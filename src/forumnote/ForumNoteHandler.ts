import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnRecordSet, KnSQL, KnResultSet } from "@willsofts/will-sql";
import { VerifyError, KnValidateInfo, KnContextInfo, KnDataTable, KnDataEntity, KnDataSet } from '@willsofts/will-core';
import { ForumHandler } from "../forum/ForumHandler";
import { TknAttachHandler, KnPageUtility } from "@willsofts/will-core";
import { FileImageInfo, RagInfo } from "../models/QuestionAlias";
import { QuestionUtility } from "../question/QuestionUtility";
import { OPERATE_HANDLERS } from '@willsofts/will-serv';
import { API_KEY, API_MODEL } from "../utils/EnvironmentVariable";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { PromptUtility } from "../question/PromptUtility";
import { SumDocHandler } from "../sumdoc/SumDocHandler";
import { RAG_API_KEY, RAG_API_URL, RAG_API_URL_UPLOAD } from "../utils/EnvironmentVariable";
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(API_KEY);

export class ForumNoteHandler extends ForumHandler {
    
    public group = "NOTE";
    public progid = "forumnote";

    public handlers = OPERATE_HANDLERS.concat([ {name: "config"}, {name: "dialect"}, {name: "note"} ]);

    public async note(context: KnContextInfo) : Promise<KnDataTable> {
        return this.callFunctional(context, {operate: "note", raw: false}, this.doNote);
    }

    public async doNote(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let rs = await this.doNoteGetting(context, model, KnOperation.GET);
        return await this.createCipherData(context, KnOperation.GET, rs);
    }

    protected async doNoteGetting(context: KnContextInfo, model: KnModel, action: string = KnOperation.GET) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let forumid = context.params.forumid;
            let dt = this.createDataTable(KnOperation.GET);
            let ds = await this.getForumConfig(db,forumid, context);
            if(ds) {
                dt.dataset = ds;
                dt.renderer = this.progid+"/"+this.progid+"_note";
                return dt;
            } else {
                return this.recordNotFound();
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    protected override async validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = await super.validateRequireFields(context,model,action);
        let page = new KnPageUtility(this.progid, context);
        if(page.isInsertMode(action)) {
            let fvi = this.validateParameters(context.params,"fileid");
            let svi = this.validateParameters(context.params,"summaryid");
            if(!fvi.valid && !svi.valid) {
                return Promise.reject(new VerifyError("Parameter not found ("+fvi.info+" or "+svi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
            }
        }
        return Promise.resolve(vi);
    }

    public async getAttachInfo(attachId: string, db?: KnDBConnector) : Promise<KnRecordSet> {
        try {
            let handler = new TknAttachHandler();
            handler.obtain(this.broker,this.logger);
            if(db) {
                return await handler.getAttachRecord(attachId,db);
            }
            return await handler.getAttachInfo(attachId);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        }
    }

    public async getFileImageInfo(attachId: string, db?: KnDBConnector) : Promise<FileImageInfo | null> {
        if(!attachId || attachId.length == 0) return null;
        let rs = await this.getAttachInfo(attachId,db);
        if(rs.rows && rs.rows.length > 0) {
            let row = rs.rows[0];
            let mime = row.mimetype;
            let path = row.attachpath;
            let source = row.sourcefile;
            return { image: attachId, mime: mime, file: path, source: source, stream: row.attachstream };
        }
        return null;
    }

    public getAIModel(context?: KnContextInfo) : GenerativeModel {
        let model = context?.params?.model;
        if(!model || model.trim().length==0) model = API_MODEL;
        return genAI.getGenerativeModel({ model: model,  generationConfig: { temperature: 0 }});
    }

    public async readDucumentFile(filePath: string, cleansing: string,context?: any) : Promise<any> {
        this.logger.debug(this.constructor.name+".readDucumentFile: file:",filePath);
        let isCleansing = cleansing == "1";
        let isPDF = path.extname(filePath).toLowerCase() == ".pdf";
        let data = await QuestionUtility.readDucumentFile(filePath);
        if(isPDF && (data && data.text && data.text.trim().length > 0) && isCleansing) {
            const aimodel = this.getAIModel(context);
            let prmutil = new PromptUtility();
            let prompt = prmutil.createCleansingPrompt(data.text);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".readDucumentFile: response:",text);
            data.cleartext = text;
        }
        return Promise.resolve(data);
    }

    protected async updateDocumentInfo(context: KnContextInfo, db: KnDBConnector, forumid: string) : Promise<KnResultSet | undefined> {
        this.logger.debug(this.constructor.name+".updateDocumentInfo: params",context.params);
        let rs : KnResultSet | undefined = undefined;
        let cleansing = context.params.cleansing;
        let fileid = context.params.fileid;
        let fileattachid = context.params.forumurl;
        let file_info = await this.getFileImageInfo(fileid || fileattachid,db);
        this.logger.debug(this.constructor.name+".updateDocumentInfo: fileinfo",file_info);
        if(file_info && file_info.file.length > 0) {
            let data = await this.readDucumentFile(file_info.file,cleansing,context);
            if(data && data.text && data.text.trim().length > 0) {
                let cleartext = data.cleartext ? data.cleartext : data.text; 
                let sql = new KnSQL();
                sql.append("update tforum set forumhost = ?forumhost, forumdbversion = ?forumdbversion, forumurl = ?forumurl, forumapi = ?forumapi, forumprompt = ?forumprompt, forumremark = ?forumremark ");
                sql.append("where forumid = ?forumid ");
                sql.set("forumhost",cleansing);
                sql.set("forumdbversion",context.params.model);
                sql.set("forumurl",fileid || fileattachid);
                sql.set("forumapi",file_info.source);
                sql.set("forumprompt",cleartext);
                sql.set("forumremark",data.text);
                sql.set("forumid",forumid);
                rs = await sql.executeUpdate(db);
            } else {
                let sql = new KnSQL();
                sql.append("update tforum set forumurl = ?forumurl, forumapi = ?forumapi ");
                sql.append("where forumid = ?forumid ");
                sql.set("forumurl",fileid || fileattachid);
                sql.set("forumapi",file_info.source);
                sql.set("forumid",forumid);
                rs = await sql.executeUpdate(db);
            }
            let rag : RagInfo = {
                ragflag: context.params.ragflag || "1", ragactive: "0", 
                raglimit: Utilities.parseInteger(context.params.raglimit) || 10,
                ragchunksize: Utilities.parseInteger(context.params.ragchunksize) || 250,
                ragchunkoverlap: Utilities.parseInteger(context.params.ragchunkoverlap) || 10
            };
            this.logger.debug(this.constructor.name+".updateDocumentInfo: rag",rag);
            await this.updateRAG(context,db,forumid,file_info,rag);
        }
        return Promise.resolve(rs);
    }

    public async getRagInfo(context: KnContextInfo, db: KnDBConnector, forumid: string) : Promise<RagInfo | undefined> {
        let result : RagInfo | undefined = undefined;
        let rs = await this.getForumRecord(db, forumid, context);
        if(rs.rows.length>0) {
            let row = rs.rows[0];
            result = {
                ragflag: row.ragflag,
                ragactive: row.ragactive,
                raglimit: row.raglimit,
                ragchunksize: row.ragchunksize,
                ragchunkoverlap: row.ragchunkoverlap,
            };  
        }
        return result;
    }

    protected async updateRAG(context: KnContextInfo, db: KnDBConnector, forumid: string, file_info: FileImageInfo, rag: RagInfo) : Promise<any> {
        //RAG does not accept id contain - then change it to _
        let id = forumid.replaceAll('-','_');
        const form = new FormData();
        form.append("library_id",id);
        let found = false;
        let filePath = file_info.file;
        if(fs.existsSync(filePath)) {
            const filestream = fs.createReadStream(filePath);
            form.append('files', filestream);
            found = true;
        } else {
            if(file_info?.stream) {
                const buffer = Buffer.from(file_info.stream, 'base64');
                form.append('files', buffer, {filename: file_info.source, contentType: file_info.mime });
                found = true;
            }
        }
        this.logger.debug(this.constructor.name+".updateRAG: found",found," rag",rag);
        if(found && rag) {
            //let rag = await this.getRagInfo(context,db,forumid);
            form.append("chunk_size",Utilities.parseInteger(rag.ragchunksize) || "250");
            form.append("chunk_overlap",Utilities.parseInteger(rag.ragchunkoverlap) || "10");
            await this.updateRagDocument(form,rag);
            await this.performUpdateRag(context,db,forumid,rag);
        }
    }

    protected async updateRagDocument(form: FormData, rag: RagInfo) : Promise<RagInfo> {
        rag.ragactive = "0";
        try {
            let url = RAG_API_URL + RAG_API_URL_UPLOAD;
            const response = await axios.post(url, form, {
                headers: {
                    'x-api-key': RAG_API_KEY,
                    ...form.getHeaders(),
                },
            });    
            this.logger.debug(this.constructor.name+'.updateRagDocument: success:', response.data);
            rag.ragnote = JSON.stringify(response.data);
            if(response.data?.head?.status?.code=="200") {
                rag.ragactive = "1";
            }
        } catch(ex: any) {
            rag.ragnote = ex.message;
            this.logger.error(this.constructor.name+".updateRagDocument: error:",ex);
        }
        return rag;
    }

    protected async performUpdateRag(context: KnContextInfo, db: KnDBConnector, forumid: string, rag: RagInfo) : Promise<KnRecordSet> {
        let sql = new KnSQL();
        sql.append("update tforum set ragactive = ?ragactive, ragnote = ?ragnote ");
        sql.append("where forumid = ?forumid ");
        sql.set("forumid",forumid);
        sql.set("ragactive",rag.ragactive);
        sql.set("ragnote",rag.ragnote);
        let rs = await sql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    protected override async performRetrieving(db: KnDBConnector, forumid: string, context?: KnContextInfo): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select tforum.*,tdialect.dialectalias,tdialect.dialecttitle,dialectoptions ");
        knsql.append("from tforum ");
        knsql.append("left join tdialect on tforum.forumdialect = tdialect.dialectid ");
        knsql.append("where tforum.forumid = ?forumid ");
        knsql.set("forumid",forumid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }    

    protected override async performCreating(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let rs = await super.performCreating(context,model,db);
        if(rs && rs.rows && rs.rows.length > 0) {
            let row = rs.rows[0];
            await this.updateDocumentInfo(context,db,row.forumid);
        }
        return rs;
    }

    protected override async performUpdating(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let rs = await super.performUpdating(context,model,db);
        await this.updateDocumentInfo(context,db,context.params.forumid);
        return rs;
    }

    public override async getDataAdd(context: KnContextInfo, model: KnModel = this.model) : Promise<KnDataTable> {
        let dt = await super.getDataAdd(context,model);
        dt.dataset["ragflag"] = "1";
        dt.dataset["raglimit"] = 10;
        dt.dataset["ragchunksize"] = 250;
        dt.dataset["ragchunkoverlap"] = 10;
        return dt;        
    }

    public override async getDataEntry(context: KnContextInfo, model: KnModel = this.model) : Promise<KnDataTable> {
        let dt = await this.getDataAdd(context, model);
        dt.renderer = this.progid+"/"+this.progid+"_edit";
        return dt;
    }    
    
    public async getDataNote(context: KnContextInfo, model: KnModel = this.model) : Promise<KnDataTable> {
        let dialog = context.params.dialog;
        let dt = await this.doNoteGetting(context, model);
        dt.renderer = this.progid+"/"+this.progid+"_note"+(dialog ? "_dialog" : "");
        return dt;
    }    

    protected override async performCategories(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnDataTable> {
        let dt = await super.performCategories(context,model,db);
        let handler = new SumDocHandler();
        handler.obtain(this.broker,this.logger);
        let sumdocs : KnDataSet = { };
        let entity = dt.entity as KnDataEntity;
        let rs = await handler.sumlist(context);
        if(rs.rows.length>0) {
            for(let row of rs.rows) {
                sumdocs[row.summaryid] = row.summarytitle;
            }
        }
        entity["sumdocs"] = sumdocs;
        return dt;
    }

    protected override async retrieveDataSet(context: KnContextInfo, db: KnDBConnector, rs: KnRecordSet) : Promise<KnDataSet> {
        let ds = await super.retrieveDataSet(context,db,rs);
        ds.raglimit = Utilities.parseInteger(ds.raglimit);
        ds.ragchunksize = Utilities.parseInteger(ds.ragchunksize);
        ds.ragchunkoverlap = Utilities.parseInteger(ds.ragchunkoverlap);
        return ds;
    }

}
