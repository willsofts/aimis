import config from "@willsofts/will-util";
import { KnModel, KnTrackingInfo } from "@willsofts/will-db";
import { KnDBConnector } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, KnValidateInfo, VerifyError } from "@willsofts/will-core";
import { TknOperateHandler } from '@willsofts/will-serv';
import { ForumConfig, KnInquirySet, QuestInfo } from "../models/QuestionAlias";
import { ForumHandler } from "../forum/ForumHandler";
import { QuestionUtility } from "./QuestionUtility";
import { PRIVATE_SECTION, RAG_API_ASYNC } from "../utils/EnvironmentVariable";

export class InquiryHandler extends TknOperateHandler {
    public section = PRIVATE_SECTION;
    public progid = "inquiry";
    public model : KnModel = { 
        name: "tinquiry", 
        alias: { privateAlias: this.section }, 
    };
    public handlers = [ {name: "inquire"}, {name:"enquire"}, {name:"queries"} ];

    public async inquire(context: KnContextInfo) : Promise<KnInquirySet> {
        return this.callFunctional(context, {operate: "inquire", raw: false}, this.doInquire);
    }

    public async enquire(context: KnContextInfo) : Promise<KnInquirySet> {
        return this.callFunctional(context, {operate: "enquire", raw: false}, this.doEnquire);
    }

    public async queries(context: KnContextInfo) : Promise<KnInquirySet> {
        return this.callFunctional(context, {operate: "queries", raw: false}, this.doQueries);    
    }

    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"query");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    public override track(context: KnContextInfo, info: KnTrackingInfo): Promise<void> {
        return Promise.resolve();
    }

    protected createCorrelation(context: KnContextInfo) {
        console.log("context.meta.session.id",context.meta.session.id);
        let correlationid = context.meta.session.correlation;
        if(!correlationid) { 
            correlationid = context.meta.session.id;
            context.meta.session.correlation = correlationid; 
        }
        console.log("context.meta.session.correlation",context.meta.session.correlation);
        return correlationid;
    }

    public async doInquire(context: KnContextInfo, model: KnModel = this.model) : Promise<KnInquirySet> {
        let query = context.params.query;
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let quest : QuestInfo = {correlation: correlationid, questionid: context.params.questionid, question: "", mime:"", image:"", category:""};
        return this.processInquire(query, quest, this.section, model);
    }

    public async processInquire(query: string, quest: QuestInfo, section: string = this.section, model: KnModel = this.model) : Promise<KnInquirySet> {
        let vi = this.isValidQuery(query);
        if(!vi.valid) {
            return Promise.reject(new VerifyError(""+vi.info,HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = config.has(section) ? this.getConnector(section) : this.getPrivateConnector(model);
        try {
            return await this.processEnquiry(query, quest, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public isValidQuery(sql: string) : KnValidateInfo {
        if(sql.trim().length == 0) {
            return {valid: false, info: "No SQL found in the response."};
        }
        if(QuestionUtility.hasIntensiveQuery(sql)) {
            return {valid: false, info: "Intensive query not allow."};
        }
        return {valid:true};
    }

    public async processEnquiry(query: string, quest: QuestInfo, db: KnDBConnector) : Promise<KnInquirySet> {
        this.logger.debug(this.constructor.name+".processEnquiry: query",query);
        let rs = await db.executeQuery(query);
        this.logger.debug(this.constructor.name+".processEnquiry: rs",rs);
        let rss = this.createRecordSet(rs);
        return {correlation: quest.correlation, questionid: quest.questionid, ...rss};
    }

    public async doEnquire(context: KnContextInfo, model: KnModel = this.model) : Promise<KnInquirySet> {
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let quest : QuestInfo = {correlation: correlationid, questionid: context.params.questionid, question: "", mime:"", image:"", category:""};
        let query = context.params.query;
        let vi = this.validateParameters(context.params,"category");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        vi = this.isValidQuery(query);
        if(!vi.valid) {
            return Promise.reject(new VerifyError(""+vi.info,HTTP.NOT_ACCEPTABLE,-16061));
        }
        let category = context.params.category;
        let db = this.getPrivateConnector(model);
        try {
            let forum = await this.getForumConfig(db,category,context);
            return await this.performEnquiry(query, quest, forum);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }        
    }

    public async getForumConfig(db: KnDBConnector, category: string,context?: KnContextInfo) : Promise<ForumConfig> {
        let handler = new ForumHandler();
        let result = await handler.getForumConfig(db,category,context);
        if(!result) {
            return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        }
        return result;
    }

    public async performEnquiry(sql: string, quest: QuestInfo, forum: ForumConfig) : Promise<KnInquirySet> {
        if(forum.type=="DB") {
            return this.processQuery(sql, quest, forum);
        }
        return Promise.reject(new VerifyError("Not accept configuration type setting",HTTP.NOT_ACCEPTABLE,-16061));
    }

    protected async processQuery(sql: string, quest: QuestInfo, forum: ForumConfig) : Promise<KnInquirySet> {
        let db = this.getConnector(forum);
        try {
            return await this.processEnquiry(sql, quest, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public getContextConfig(context: KnContextInfo) : ForumConfig {
        return {
            caption: context.params.caption || "",
            title: context.params.title || "",
            type: context.params.type || "DB",
            tableinfo: context.params.tableinfo || "",
            schema: context.params.schema,
            alias: context.params.alias,
            dialect: context.params.dialect,
            url: context.params.url,
            user: context.params.user,
            password: context.params.password,
            host: context.params.host,
            port: context.params.port,
            database: context.params.database, 
            webhook: context.params.webhook,       
            hookflag: context.params.hookflag,
            ragasync: RAG_API_ASYNC,
        };
    }

    public async doQueries(context: KnContextInfo, model: KnModel = this.model) : Promise<KnInquirySet> {
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let quest : QuestInfo = {correlation: correlationid, questionid: context.params.questionid, question: "", mime:"", image:"", category:""};
        let query = context.params.query;        
        let vi = this.isValidQuery(query);
        if(!vi.valid) {
            return Promise.reject(new VerifyError(""+vi.info,HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let forum = this.getContextConfig(context);
            return await this.performEnquiry(query, quest, forum);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }        
    }

}

/*
curl -X POST http://localhost:8080/api/inquiry/inquire -d "query=select * from cust_product"
curl -X POST http://localhost:8080/api/inquiry/enquire -d "category=AIDB1&query=select * from cust_product"
curl -X POST http://localhost:8080/api/inquiry/queries -d "type=DB&dialect=MYSQL&alias=MYSQL2&user=root&password=root&host=localhost&port=3306&database=aidb1&query=select * from cust_product"
*/
