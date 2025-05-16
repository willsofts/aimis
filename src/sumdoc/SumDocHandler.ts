import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnResultSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { VerifyError, KnValidateInfo, KnContextInfo, KnDataTable, KnPageUtility } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { OPERATE_HANDLERS } from '@willsofts/will-serv';
import { TknAttachHandler } from "@willsofts/will-core";
import { PRIVATE_SECTION, ALWAYS_RAG, RAG_API_ASYNC } from "../utils/EnvironmentVariable";
import { SummaryDocumentInfo, InlineImage, RagInfo } from "../models/QuestionAlias";
import { API_KEY, API_MODEL } from "../utils/EnvironmentVariable";
import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { PromptUtility } from "../question/PromptUtility";
import { ollamaGenerate } from "../ollama/generateOllama";
import { PDFReader } from "../detect/PDFReader";
import { GenerativeOperate } from "../handlers/GenerativeOperate";
import FormData from 'form-data';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(API_KEY);

export class SumDocHandler extends GenerativeOperate {

    public section = PRIVATE_SECTION;
    public group = "SUM";
    public progid = "sumdoc";
    public model : KnModel = { 
        name: "tsummarydocument", 
        alias: { privateAlias: this.section }, 
        fields: {
            summaryid: { type: "STRING", key: true },
            summarytitle: { type: "STRING" },
            summaryagent: { type: "STRING", created: true, updated: true },
            summarymodel: { type: "STRING", created: true, updated: true },
            summaryfile: { type: "STRING" },
            summaryprompt: { type: "STRING", created: true, updated: true },
            summaryflag: { type: "STRING", selected: true, created: true, defaultValue: "0" },
            shareflag: { type: "STRING", selected: true, created: true, updated: true, defaultValue: "0" },
            inactive: { type: "STRING", selected: true, created: false, updated: false, defaultValue: "0" },
            ragflag: { type: "STRING", selected: true, created: true, updated: true, defaultValue: "0" },
            ragactive: { type: "STRING", selected: true },
            raglimit: { type: "INTEGER", selected: true },
            ragchunksize: { type: "INTEGER", selected: true },
            ragchunkoverlap: { type: "INTEGER", selected: true },
            createmillis: { type: "BIGINT", selected: true, created: true, updated: false, defaultValue: Utilities.currentTimeMillis() },
            createdate: { type: "DATE", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createtime: { type: "TIME", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createuser: { type: "STRING", selected: false, created: true, updated: false, defaultValue: null },
            editmillis: { type: "BIGINT", selected: false, created: true, updated: true, defaultValue: Utilities.currentTimeMillis() },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null },
            summaryfilename: { type: "STRING", calculated: true },
        },
    };

    public handlers = OPERATE_HANDLERS.concat([ {name: "summary"}, {name: "sumlist"}, {name: "attachremove"} ]);    

    public async summary(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "summary", raw: false}, this.doSummary);
    }

    public async doSummary(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.GENERATE);
        let rs = await this.doSummarying(context, model, KnOperation.GENERATE);
        return await this.createCipherData(context, KnOperation.GENERATE, rs);
    }

    public async sumlist(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "sumlist", raw: false}, this.doSummaryList);
    }

    public async doSummaryList(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doSummaryListing(context, model, KnOperation.LIST);
        return await this.createCipherData(context, KnOperation.LIST, rs);
    }

    public async attachremove(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "attachremove", raw: false}, this.doAttachRemove);
    }

    public async doAttachRemove(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doAttachRemoving(context, model, KnOperation.REMOVE);
        return await this.createCipherData(context, KnOperation.REMOVE, rs);
    }

    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {        
        let model_item = await this.getModelItem(context.params.summarymodel);
        let now = Utilities.now();
        sql.set("createdate",now,"DATE");
        sql.set("createtime",now,"TIME");
        sql.set("createmillis",Utilities.currentTimeMillis(now));
        sql.set("createuser",this.userToken?.userid);
        sql.set("editdate",now,"DATE");
        sql.set("edittime",now,"TIME");
        sql.set("editmillis",Utilities.currentTimeMillis(now));
        sql.set("edituser",this.userToken?.userid);
        sql.set("summaryprompt",context.params.summaryprompt);
        sql.set("summaryagent",model_item?.agent || "GEMINI");
        sql.set("summarymodel",context.params.summarymodel || API_MODEL);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi : KnValidateInfo = {valid: true};
        let page = new KnPageUtility(this.progid, context);
        if(page.isInsertMode(action)) {
            vi = this.validateParameters(context.params,"summarytitle");
        } else {
            vi = this.validateParameters(context.params,"summaryid");
        }
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let params = context.params;
            knsql.append(selector);
            knsql.append(" from ");
            knsql.append(model.name);
            let filter = " where ";
            if(this.userToken?.userid) {
                knsql.append(filter).append(" ( createuser = ?userid or createuser is null or shareflag = '1') ");
                knsql.set("userid",this.userToken?.userid);
                filter = " and ";    
            }
            if(params.summarytitle && params.summarytitle!="") {
                knsql.append(filter).append("summarytitle LIKE ?summarytitle");
                knsql.set("summarytitle","%"+params.summarytitle+"%");
                filter = " and ";
            }
            if(params.fromdate && params.fromdate!="") {
                let fromdate = Utilities.parseDate(params.fromdate);
                if(fromdate) {
                    knsql.append(filter).append("createdate >= ?fromdate");
                    knsql.set("fromdate",fromdate);
                    filter = " and ";
                }
            }
            if(params.todate && params.todate!="") {
                let todate = Utilities.parseDate(params.todate);
                if(todate) {
                    knsql.append(filter).append("createdate <= ?todate");
                    knsql.set("todate",todate);
                    filter = " and ";
                }
            }
            if(params.inactive && params.inactive!="") {
                knsql.append(filter).append("inactive = ?inactive");
                knsql.set("inactive",params.inactive);
                filter = " and ";
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected override async doGet(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.GET);
        let rs = await this.doGetting(context, model, KnOperation.GET);
        return await this.createCipherData(context, KnOperation.GET, rs);
    }

    protected async doGetting(context: KnContextInfo, model: KnModel = this.model, action: string = KnOperation.GET): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performGetting(db, context.params.summaryid, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async performGetting(db: KnDBConnector, summaryid: string, context?: KnContextInfo): Promise<KnRecordSet> {
        return this.performRetrieving(db,summaryid,context,"summaryid,summarytitle,summaryfile,summaryflag,summarydocument");
    }    

    protected override async doRetrieving(context: KnContextInfo, model: KnModel = this.model, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(db, context.params.summaryid, context);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                if(row.summaryflag == '1') {
                    row.summaryfilename = row.summaryfile || row.summarytitle;
                }
                let models = await this.getAgentModels();
                let list = await this.performListing(context,model,db);
                return this.createDataTable(KnOperation.RETRIEVE, row, {tmodels: models, attachfiles: list.rows});
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async performRetrieving(db: KnDBConnector, summaryid: string, context?: KnContextInfo, selector: string = "*"): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select ").append(selector);
        knsql.append(" from tsummarydocument ");
        knsql.append("where summaryid = ?summaryid ");
        knsql.set("summaryid",summaryid);
        this.logger.debug(this.constructor.name+".performRetrieving: ",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }    

    protected override async doList(context: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performListing(context, model, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    protected async performListing(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let summaryid = context.params.summaryid;
        let group = context.params.group;
        if(!group || group.trim().length==0) group = this.group;
        let knsql = new KnSQL();
        knsql.append("select attachid,attachfile,sourcefile,attachdate,attachtime,attachmillis ");
        knsql.append("from tattachfile ");
        knsql.append("where attachno = ?attachno and attachtype = ?attachtype ");
        knsql.append("order by attachmillis ");
        knsql.set("attachno",summaryid);
        knsql.set("attachtype",group);
        this.logger.debug(this.constructor.name+".performListing",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    protected async doSummaryListing(context: KnContextInfo, model: KnModel = this.model, action: string = KnOperation.LIST) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performSummaryListing(context, model, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    protected async performSummaryListing(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select summaryid,summarytitle ");
        knsql.append("from tsummarydocument ");
        knsql.append("where inactive = '0' and summaryflag = '1' ");
        if(this.userToken?.userid) {
            knsql.append("and ( createuser = ?userid or createuser is null or shareflag = '1') ");
            knsql.set("userid",this.userToken?.userid);
        }
        knsql.append("order by summarytitle ");
        this.logger.debug(this.constructor.name+".performSummaryListing",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    protected override async performClearing(context: any, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        await this.deleteAttachFiles(context, model, db, context.params.summaryid);
        return super.performClearing(context, model, db);
    }

    protected async deleteAttachFiles(context: any, model: KnModel, db: KnDBConnector, summaryid: string) : Promise<KnResultSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tattachfile where attachid = ?attachid or attachno = ?attachno ");
        knsql.set("attachid",summaryid);
        knsql.set("attachno",summaryid);
        return await knsql.executeUpdate(db,context);
    }

    protected override async doInserting(context: KnContextInfo, model: KnModel): Promise<KnDataTable> {
        let rs = await this.doCreating(context, model);
        if(rs && rs.rows.length>0) {
            let row = this.transformData(rs.rows[0]);
            return this.createDataTable(KnOperation.INSERT, row);
        }
        return this.createDataTable(KnOperation.INSERT);
    }

    protected override async performCreating(context: any, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let now = Utilities.now();
        let id = context.params.summaryid;
        if(!id || id.trim().length == 0) id = uuid();
        let record = {
            summaryid: id,
            summarytitle: context.params.summarytitle || "",
            summaryflag: context.params.summaryflag || "0",
            shareflag: context.params.shareflag || "0",
            inactive: context.params.inactive || "0",
            createmillis: Utilities.currentTimeMillis(now),
            createdate: now,
            createtime: Utilities.currentTime(now),
        };
        context.params.summaryid = record.summaryid;
        context.params.summarytitle = record.summarytitle;
        let knsql = this.buildInsertQuery(context, model, KnOperation.CREATE);
        await this.assignParameters(context,knsql,KnOperation.CREATE,KnOperation.CREATE);
        knsql.set("summaryid",record.summaryid);
        knsql.set("summarytitle",record.summarytitle);
        knsql.set("createmillis",record.createmillis);
        knsql.set("createdate",record.createdate,"DATE");
        knsql.set("createtime",record.createtime,"TIME");
        knsql.set("createuser",this.userToken?.userid);
        knsql.set("summaryflag",record.summaryflag);
        knsql.set("shareflag",record.shareflag);
        knsql.set("inactive",record.inactive);
        let rs = await knsql.executeUpdate(db,context);
        let rcs = this.createRecordSet(rs);
        if(rcs.records>0) {
            rcs.rows = [record];
        }
        return rcs;
    }

    public async doSummarying(context: KnContextInfo, model: KnModel, action: string = KnOperation.GENERATE) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performSummarying(context, db, context.params.summaryid);
            if(rs.records == 0) {
                return Promise.reject(new VerifyError("Document files not found",HTTP.NOT_FOUND,-16064));
            }
            return rs;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public getAIModel(suminfo: SummaryDocumentInfo, context?: KnContextInfo) : GenerativeModel {
        let model = context?.params?.model;
        if(!model || model.trim().length==0) model = suminfo.summarymodel;
        if(!model || model.trim().length==0) model = API_MODEL;
        return genAI.getGenerativeModel({ model: model,  generationConfig: { temperature: 0 }});
    }

    public async generateSummaryDocument(suminfo: SummaryDocumentInfo, context: KnContextInfo) : Promise<SummaryDocumentInfo> {
        if(suminfo.summarystreams && suminfo.summarystreams.length>0) {
            let agent = suminfo.summaryagent || "GEMINI";
            if("LLAMA" == agent || "GEMMA" == agent) {
                return this.generateSummaryDocumentByLlama(suminfo,context);
            }
            return this.generateSummaryDocumentByGemini(suminfo,context);
        }
        return Promise.resolve(suminfo);
    }

    public async generateSummaryDocumentByGemini(suminfo: SummaryDocumentInfo, context: KnContextInfo) : Promise<SummaryDocumentInfo> {
        if(suminfo.summarystreams && suminfo.summarystreams.length>0) {
            this.logger.debug(this.constructor.name+".generateSummaryDocumentByGemini: starting with stream ",suminfo.summarystreams.length);
            const aimodel = this.getAIModel(suminfo,context);
            let prompt = await this.createSummaryPrompt(suminfo);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".generateSummaryDocumentByGemini: response:",text);
            let quest = { agent: "GEMINI", model: API_MODEL, questionid: "", correlation: context.meta.session?.correlation, question: "", mime: "", image: "", category: suminfo.summaryid };
            this.saveUsage(context,quest,result.response.usageMetadata);
            suminfo.summarydocument = text;
        }
        return Promise.resolve(suminfo);
    }

    public async generateSummaryDocumentByLlama(suminfo: SummaryDocumentInfo, context: KnContextInfo) : Promise<SummaryDocumentInfo> {
        if(suminfo.summarystreams && suminfo.summarystreams.length>0) {
            let model = context?.params?.model;
            if(!model || model.trim().length==0) model = suminfo.summarymodel;    
            this.logger.debug(this.constructor.name+".generateSummaryDocumentByGemini: starting with stream ",suminfo.summarystreams.length);
            let prompt = await this.createSummaryPromptLlama(suminfo);
            let result = await ollamaGenerate(prompt, model);
            let text = result.response;
            this.logger.debug(this.constructor.name+".generateSummaryDocumentByGemini: response:",text);
            suminfo.summarydocument = text;
        }
        return Promise.resolve(suminfo);
    }

    protected async createSummaryPrompt(suminfo: SummaryDocumentInfo) : Promise<Part[]> {
        let prmutil = new PromptUtility();
        let prompt = prmutil.createSummaryPrompt(suminfo.summaryprompt);
        let contents : Part[] = [{text: prompt}];
        if(suminfo.summarystreams) {
            for(let stream of suminfo.summarystreams) {
                let info = this.getInlineInfo(stream.mime,stream.stream);
                contents.push(info);
            }
        }
        return contents;
    }

    protected async createSummaryPromptLlama(suminfo: SummaryDocumentInfo) : Promise<string> {
        let prmutil = new PromptUtility();
        let prompt = prmutil.createSummaryPrompt(suminfo.summaryprompt);
        let contents : string[] = [prompt];
        if(suminfo.summarystreams) {
            for(let stream of suminfo.summarystreams) {
                if(stream.mime == "application/pdf") {
                    let buffer = Buffer.from(stream.stream,"base64");
                    let detector = new PDFReader();
                    let data = await detector.extractText(buffer);
                    let info = data.text;
                    if(info) contents.push(data.text);
                } else {
                    let info = Buffer.from(stream.stream,"base64").toString();
                    contents.push(info);
                }
            }
        }
        return contents.join("\n\n");
    }

    public getInlineInfo(mime: string, data: string) : InlineImage {
        return {
            inlineData : {
                mimeType: mime,
                data: data
            }
        }
    }

    public async performSummarying(context: KnContextInfo, db: KnDBConnector, summaryid: string): Promise<KnRecordSet> {
        let result = this.createRecordSet();
        let suminfo = await this.getSummaryDocumentInfo(summaryid,db,context);
        if(suminfo) {
            this.logger.debug(this.constructor.name+".performSummarying: summary prompt",suminfo.summaryprompt);
            if(!suminfo.summarystreams) suminfo.summarystreams = [];
            let rs = await this.getAttachStream(summaryid,db,context);
            if(rs.rows.length>0) {
                for(let row of rs.rows) {
                    if(row.attachstream) {
                        suminfo.summarystreams.push({source: row.sourcefile, path: row.attachpath, mime: row.mimetype, stream: row.attachstream});
                    }
                }
            }
            if(suminfo.summarystreams.length>0) {
                await this.generateSummaryDocument(suminfo,context);
                if(suminfo.summarydocument) {
                    await this.updateSummaryDocument(suminfo,db,context);
                }
                let info = { summaryid: summaryid, summarytitle: suminfo.summarytitle, summaryflag: suminfo.summaryflag };
                if(ALWAYS_RAG) {
                    let rag : RagInfo = {
                        ragasync: RAG_API_ASYNC,
                        ragflag: suminfo.ragflag || "1", ragactive: "0", 
                        raglimit: suminfo.raglimit || 10,
                        ragchunksize: suminfo.ragchunksize || 250,
                        ragchunkoverlap: suminfo.ragchunkoverlap || 10
                    };
                    this.logger.debug(this.constructor.name+".performSummarying: rag",rag);
                    await this.updateRAG(context,db,suminfo,rag);
                    Object.assign(info, rag);
                }
                result.rows.push(info);
            }
        }
        result.records = result.rows.length;
        return result;
    }

    protected async updateRAG(context: KnContextInfo, db: KnDBConnector, suminfo: SummaryDocumentInfo, rag: RagInfo) : Promise<any> {
        //RAG does not accept id contain - then change it to _
        let id = suminfo.summaryid.replaceAll('-','_');
        const form = new FormData();
        form.append("library_id",id);
        let found = false;
        if(suminfo.summarystreams) {
            for(let stream of suminfo.summarystreams) {
                let filePath = stream.path;
                if(fs.existsSync(filePath)) {
                    const filestream = fs.createReadStream(filePath);
                    form.append('files', filestream);
                    found = true;
                } else {
                    if(stream.stream) {
                        const buffer = Buffer.from(stream.stream, 'base64');
                        form.append('files', buffer, {filename: stream.source, contentType: stream.mime });
                        found = true;
                    }
                }        
            }
        }
        this.logger.debug(this.constructor.name+".updateRAG: found",found," rag",rag);
        if(found && rag) {
            //let rag = await this.getRagInfo(context,db,forumid);
            form.append("chunk_size",Utilities.parseInteger(rag.ragchunksize) || "250");
            form.append("chunk_overlap",Utilities.parseInteger(rag.ragchunkoverlap) || "10");
            await this.updateRagDocument(context,form,rag);
            await this.performUpdateRag(context,db,suminfo.summaryid,rag);
        }
    }

    public async performUpdateRag(context: KnContextInfo, db: KnDBConnector, summaryid: string, rag: RagInfo) : Promise<KnRecordSet> {
        let sql = new KnSQL();
        sql.append("update tsummarydocument set ");
        if(!rag.ragasync) {
            sql.append("ragactive = ?ragactive, ");
        }
        sql.append("ragnote = ?ragnote ");
        sql.append("where summaryid = ?summaryid ");
        sql.set("summaryid",summaryid);
        sql.set("ragactive",rag.ragactive);
        sql.set("ragnote",rag.ragnote);
        let rs = await sql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    protected async doAttachRemoving(context: KnContextInfo, model: KnModel, action: string = KnOperation.REMOVE) : Promise<KnRecordSet> {
        let vi = this.validateParameters(context.params,"attachid");    
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let handler = new TknAttachHandler();
        handler.obtain(this.broker,this.logger);
        return await handler.removeAttach(context.params.attachid,context,model);
    }

    protected async getAttachStream(summaryid: string, db: KnDBConnector, context?: KnContextInfo): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select attachid,sourcefile,mimetype,attachpath,attachstream ");
        knsql.append("from tattachfile ");
        knsql.append("where attachno = ?attachno ");
        knsql.set("attachno",summaryid);
        this.logger.debug(this.constructor.name+".getAttachStream",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async getSummaryDocumentRecord(summaryid: string, db: KnDBConnector, context?: KnContextInfo): Promise<KnRecordSet> {
        return this.performRetrieving(db,summaryid,context,"summaryid,summarytitle,summaryagent,summarymodel,summaryprompt,summarydocument,ragflag,ragactive,raglimit,ragchunksize,ragchunkoverlap");
    }    

    public async getSummaryDocument(summaryid: string, context?: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.getSummaryDocumentRecord(summaryid,db,context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async getSummaryDocumentInfo(summaryid: string, db?: KnDBConnector, context?: KnContextInfo) : Promise<SummaryDocumentInfo | undefined> {
        if(!summaryid || summaryid.length == 0) return undefined;
        let rs = db ? await this.getSummaryDocumentRecord(summaryid,db,context) : await this.getSummaryDocument(summaryid,context);
        if(rs.rows && rs.rows.length > 0) {
            let row = rs.rows[0];
            return { 
                summaryid: summaryid, summarytitle: row.summarytitle, summaryagent: row.summaryagent, summarymodel: row.summarymodel, summaryprompt: row.summaryprompt, summarydocument: row.summarydocument,
                ragasync: RAG_API_ASYNC, ragflag: row.ragflag, ragactive: row.ragactive, raglimit: row.raglimit, ragchunksize: row.ragchunksize, ragchunkoverlap: row.ragchunkoverlap
            };
        }
        return undefined;
    }

    protected async updateSummaryDocument(suminfo: SummaryDocumentInfo, db: KnDBConnector, context?: KnContextInfo) : Promise<KnResultSet> {
        suminfo.summaryflag = "1";
        let knsql = new KnSQL();
        knsql.append("update tsummarydocument set summaryflag = '1', summarydocument = ?summarydocument where summaryid = ?summaryid ");
        knsql.set("summaryid",suminfo.summaryid);
        knsql.set("summarydocument",suminfo.summarydocument);
        return await knsql.executeUpdate(db,context);
    }

    /**
     * Override for search action (return data collection)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataSearch(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let rs = await this.doCollecting(context, model);
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, this.progid+"/"+this.progid+"_data");
    }
    
    /**
     * Override for retrieval action (return record not found error if not found any record)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataRetrieval(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(db, context.params.summaryid, context);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                if(row.summaryflag == '1') {
                    row.summaryfilename = row.summaryfile || row.summarytitle;
                }
                let models = await this.getAgentModels();
                let list = await this.performListing(context,model,db);
                return this.createDataTable(KnOperation.RETRIEVAL, row, {tmodels: models, attachfiles: list.rows}, this.progid+"/"+this.progid+"_dialog");
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    /**
     * Override for add new record action (prepare screen for add)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataAdd(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let models = await this.getAgentModels();
        let dt = this.createDataTable(KnOperation.ADD,{},{tmodels: models});
        dt.action = KnOperation.ADD;
        dt.renderer = this.progid+"/"+this.progid+"_dialog";
        dt.dataset["summaryid"] = uuid();
        dt.dataset["summaryflag"] = "0";
        dt.dataset["summaryprompt"] = "Summarize into plain text answer only from given info";
        dt.dataset["ragflag"] = "1";
        dt.dataset["raglimit"] = 10;
        dt.dataset["ragchunksize"] = 250;
        dt.dataset["ragchunkoverlap"] = 10;
        return dt;
    }

    public override async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let models = await this.getAgentModels();
        let rs = await this.doList(context,model);
        let dt = this.createDataTable(KnOperation.VIEW,{},{tmodels: models, attachfiles: rs.rows});
        dt.renderer = this.progid+"/"+this.progid+"_kit_file_data";
        return dt;
    }    

    public async exports(context: KnContextInfo, req: Request, res: Response) : Promise<void> {
        this.logger.debug(this.constructor.name+".exports: params",context.params);
        let rs = await this.doGetting(context);
        if(rs && rs.rows?.length > 0) {
            let row = rs.rows[0];
            if(row.summaryflag == '0' || !row.summarydocument) {
                let sumstatus = "NOT PROCESS";
                this.logger.debug(this.constructor.name+".exports: ",sumstatus);
                res.status(HTTP.NOT_ALLOWED).send(sumstatus);
                return;
            }
            let filename = row.summaryfile || row.summarytitle || row.summaryid;
            res.attachment(filename+".txt");
            res.send(row.summarydocument);
            return;
        }
        this.logger.debug(this.constructor.name+".exports: not found");
        res.status(HTTP.NOT_FOUND).send("Not found");
    }

}
