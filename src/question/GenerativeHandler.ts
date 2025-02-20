import { v4 as uuid } from 'uuid';
import { KnModel } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, KnValidateInfo, VerifyError } from "@willsofts/will-core";
import { TknOperateHandler } from '@willsofts/will-serv';
import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { API_KEY, API_VISION_MODEL, ALWAYS_REMOVE_ATTACH } from "../utils/EnvironmentVariable";
import { QuestionUtility } from "./QuestionUtility";
import { QuestInfo, InquiryInfo, InlineImage, FileImageInfo, ForumConfig } from "../models/QuestionAlias";
import { TknAttachHandler } from "@willsofts/will-core";
import { KnRecordSet, KnDBConnector } from "@willsofts/will-sql";
import { KnDBLibrary } from "../utils/KnDBLibrary";
import { ForumHandler } from "../forum/ForumHandler";
import { TokenUsageHandler } from "../tokenusage/TokenUsageHandler";

const genAI = new GoogleGenerativeAI(API_KEY);

export class GenerativeHandler extends TknOperateHandler {

    public getContext() : KnContextInfo {
        return { params: {}, meta: {}, options: {}};
    }
    
    public async quest(context: KnContextInfo) : Promise<InquiryInfo> {
        return this.callFunctional(context, {operate: "quest", raw: true}, this.doQuest);
    }

    public async ask(context: KnContextInfo) : Promise<InquiryInfo> {
        return this.callFunctional(context, {operate: "ask", raw: true}, this.doAsk);
    }

    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        return this.validateInputFields(context, model, "query");
    }

    protected validateInputFields(context: KnContextInfo, model: KnModel, ...fieldname: string[]) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,...fieldname);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected createCorrelation(context: KnContextInfo) {
        let correlationid = context.meta.session?.correlation;
        if(!correlationid) { 
            correlationid = context.meta.session?.id || uuid();
            if(!context.meta.session) context.meta.session = {};
            context.meta.session.correlation = correlationid; 
        }
        return correlationid;
    }

    public async doQuest(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        return this.notImplementation();
    }

    public async doAsk(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        return this.notImplementation();
    }

    public validateParameter(question: string, mime: string, image: string) : KnValidateInfo {
        if(!question || question.length == 0) {
            return {valid: false, info: "question" };
        }
        if(!image || image.length == 0) {
            return {valid: false, info: "image"};
        }
        if(!mime || mime.length == 0) {
            return {valid: false, info: "mime type"};
        }
        return {valid: true};
    }

    public getAIModel(context?: KnContextInfo) : GenerativeModel {
        let model = context?.params?.model;
        if(!model || model.trim().length==0) model = API_VISION_MODEL;
        this.logger.debug(this.constructor.name+".getAIModel: using model",model);
        return genAI.getGenerativeModel({ model: model,  generationConfig: { temperature: 0 }});
    }

    public async deleteAttach(attachId: string) : Promise<void> {
        if(ALWAYS_REMOVE_ATTACH && (attachId && attachId.length > 0)) {
            this.call("attach.remove",{id: attachId}).catch(ex => this.logger.error(this.constructor.name,ex));
        }
    }

    public async getAttachImageInfo(attachId: string, db?: KnDBConnector) : Promise<InlineImage | null> {
        let rs = await this.getAttachInfo(attachId,db);
        if(rs.rows && rs.rows.length > 0) {
            let row = rs.rows[0];
            let mime = row.mimetype;
            let images = row.attachstream;
            return this.getImageInfo(mime,images);
        }
        return null;
    }

    public async getAttachInfo(attachId: string, db?: KnDBConnector) : Promise<KnRecordSet> {
        try {
            let handler = new TknAttachHandler();
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
        let rs = await this.getAttachInfo(attachId,db);
        if(rs.rows && rs.rows.length > 0) {
            let row = rs.rows[0];
            let mime = row.mimetype;
            let path = row.attachpath;
            let source = row.sourcefile;
            let stream = row.attachstream;
            return { image: attachId, mime: mime, file: path, source: source, stream: stream };
        }
        return null;
    }

    public getImageInfo(mime: string, images: string) : InlineImage {
        return {
            inlineData : {
                mimeType: mime,
                data: images
            }
        }
    }

    public getImageData(imagefile: string) {
        return QuestionUtility.getImageData(imagefile);
    }

    public parseAnswer(answer: string, defaultAnswer: boolean = true) : string {
        return QuestionUtility.parseAnswer(answer, defaultAnswer);
    }

    public parseJSONAnswer(answer: string) : string {
        return QuestionUtility.parseJSONAnswer(answer);
    }

    public isValidQuery(sql: string, info: InquiryInfo) : boolean {
        if(sql.trim().length == 0) {
            info.error = true;
            info.answer = "No SQL found in the response.";
            return false;
        }
        if(QuestionUtility.hasIntensiveQuery(sql)) {
            info.error = true;
            info.answer = "Intensive query not allow.";
            return false;            
        }
        return true;
    }

    public async getDatabaseVersioning(forum?: ForumConfig) : Promise<string> {
        if(forum && forum.type=="DB") {
            let db = this.getConnector(forum);
            try {
                let result = await KnDBLibrary.getDBVersion(db, forum);
                if(result && result.trim().length>0) return result;
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                return Promise.reject(this.getDBError(ex));
            } finally {
                if(db) db.close();
            }
        }
        return forum?.version || "";
    }

    public getDatabaseTableInfo(category: string = "") : string {
        return QuestionUtility.readDatabaseFileInfo(this.getDatabaseSchemaFile(category));
    }

    public getDatabaseSchemaFile(category: string = "") : string {
        return QuestionUtility.getDatabaseSchemaFile(category);
    }

    public async getForumConfig(db: KnDBConnector, category: string, context?: KnContextInfo) : Promise<ForumConfig | undefined> {
        let handler = new ForumHandler();
        let result = await handler.getForumConfig(db,category,context);
        if(!result) {
            return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        }
        return result;
    }

    public async processAPI(sql: string, category: string, quest: QuestInfo, forum: ForumConfig) : Promise<KnRecordSet> {
        if(forum.api && forum.api.trim().length>0) {
            return this.requestAPI(sql, category, quest, forum);
        }
        return Promise.reject(new VerifyError("API setting not found",HTTP.NOT_FOUND,-16004));
    }

    protected async requestAPI(sql: string, category: string, quest: QuestInfo, forum: ForumConfig) : Promise<KnRecordSet> {
        let response;
        let body = JSON.stringify({ category: category, correlation: quest.correlation, questionid: quest.questionid, query: sql });
        let url = forum.api as string;
        let params = {};
        let settings = {};
        if(forum.setting && forum.setting.trim().length>0) {
            try { 
                settings = JSON.parse(forum.setting);
            } catch(ex) { settings = {}; }
        }
        this.logger.debug(this.constructor.name+".requestAPI: fetch : url=",url," body=",body," settings=",settings);
        try {
            response = await fetch(url, Object.assign(Object.assign({}, params), { method: "POST", headers: {
                    "Content-Type": "application/json", ...settings
                }, body }));
            if (!response.ok) {
                let msg = "Response error";
                try {
                    const json = await response.json();
                    this.logger.debug(this.constructor.name+".requestAPI: response not ok:",json);
                    if(json.head.errordesc) {
                        msg = json.head.errordesc as string;
                    }
                } catch (e) { }                
                this.logger.error(this.constructor.name+".requestAPI: response error:",msg);
                throw new Error(`[${response.status}] ${msg}`);
            }
            try {
                const json = await response.json();
                if("Y"==json.head.errorflag || "1"==json.head.errorflag) {
                    throw new Error(json.head.errordesc as string);
                }
                return json.body as KnRecordSet;
            } catch (e) { }
        } catch (ex: any) {
            this.logger.error(this.constructor.name+".requestAPI: error:",ex);
            return Promise.reject(new VerifyError(ex.message,HTTP.INTERNAL_SERVER_ERROR,-11102));
        } 
        return { records: 0, rows: [], columns: [] };       
    }

    public async notifyMessage(info: InquiryInfo, forum?: ForumConfig) : Promise<void> {
        if(forum && (forum.webhook && forum.webhook.trim().length>0) && (forum.hookflag=="1")) {
            this.sendMessage(info,forum);
        }
    }

    protected async sendMessage(info: InquiryInfo, forum: ForumConfig) : Promise<void> {
        let body = JSON.stringify(info);
        let url = forum.webhook as string;
        let params = {};
        let settings = {};
        this.logger.debug(this.constructor.name+".sendMessage: post url=",url);
        try {
            await fetch(url, Object.assign(Object.assign({}, params), { method: "POST", headers: {
                    "Content-Type": "application/json", ...settings
                }, body }));
        } catch (ex: any) {
            this.logger.error(this.constructor.name+".sendMessage: error:",ex);
        }         
    }

    protected async saveUsage(context: KnContextInfo, quest: QuestInfo, counter: any) : Promise<void> {
        let handler = new TokenUsageHandler();
        handler.obtain(this.broker,this.logger);
        handler.userToken = this.userToken;
        handler.save(context,quest,counter).catch(ex => console.error(ex));
    }

    protected async saveTokenUsage(context: KnContextInfo, quest: QuestInfo, prompt: string | Array<string | Part>, aimodel: GenerativeModel) : Promise<void> {
        try {
            const countResult = await aimodel.countTokens(prompt);
            this.logger.debug(this.constructor.name+".saveTokenUsage: count result:",countResult);
            this.saveUsage(context, quest, countResult);
        } catch(ex) {
            this.logger.error(ex);
        }
    }

}
