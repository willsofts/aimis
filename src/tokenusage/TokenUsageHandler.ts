import { KnModel, KnOperation, KnSetting } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnResultSet, KnSQL } from "@willsofts/will-sql";
import { KnContextInfo, KnDataTable } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '@willsofts/will-serv';
import { PRIVATE_SECTION, API_MODEL } from "../utils/EnvironmentVariable";
import { QuestInfo } from "../models/QuestionAlias";

export class TokenUsageHandler extends TknOperateHandler {
    public section = PRIVATE_SECTION;
    public progid = "tokenusage";
    public model : KnModel = { 
        name: "ttokenusage", 
        alias: { privateAlias: this.section }, 
        fields: {
            site: { type: "STRING", created: true },
            userid: { type: "STRING", created: true },
            useruuid: { type: "STRING", created: true },
            authtoken: { type: "STRING", created: true },
            createdate: { type: "DATE", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createtime: { type: "TIME", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createmillis: { type: "BIGINT", selected: true, created: true, updated: false, defaultValue: Utilities.currentTimeMillis() },
            createuser: { type: "STRING", selected: false, created: true, updated: false, defaultValue: null },
            usagetype: { type: "STRING" },
            agentid: { type: "STRING" },
            modelid: { type: "STRING" },
            categoryid: { type: "STRING" },
            classifyid: { type: "STRING" },
            tokencount: { type: "BIGINT" },
            questionid: { type: "STRING" },
            correlation: { type: "STRING" },
        },
    };
    public settings : KnSetting = { rowsPerPage: 10, maxRowsPerPage: 100, maxLimit: -1, disableColumnSchema: true, disableQueryPaging: true };

    /* try to assign individual parameters under this context */
    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        let authtoken = this.getTokenKey(context);
        if(!this.userToken) this.userToken = await this.getUserTokenInfo(context,true);
        sql.set("authtoken",authtoken);
        sql.set("site",this.userToken?.site);
        sql.set("userid",this.userToken?.userid);
        sql.set("useruuid",this.userToken?.useruuid);
        sql.set("createmillis",Utilities.currentTimeMillis());
        sql.set("createdate",Utilities.now(),"DATE");
        sql.set("createtime",Utilities.now(),"TIME");
        sql.set("createuser",this.userToken?.userid);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let counting = KnOperation.COUNT==subaction;
            let params = context.params;
            if(counting) {
                knsql.append(selector);
            } else {
                knsql.clear();
                knsql.append("select createdate,sum(tokencount) as tokencount ");
            }
            knsql.append(" from ");
            knsql.append(model.name);
            let filter = " where ";
            knsql.append(filter).append(" createuser = ?userid ");
            knsql.set("userid",this.userToken?.userid);
            filter = " and ";    
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
            if(!counting) {
                knsql.append(" group by createdate ");
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected override async doGet(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        await this.validateRequireFields(context, model, KnOperation.GET);
        let rs = await this.doGetting(context, model, KnOperation.GET);
        return await this.createCipherData(context, KnOperation.GET, rs);
    }

    protected async doGetting(context: KnContextInfo, model: KnModel, action: string = KnOperation.GET): Promise<KnDataTable> {
        return this.doRetrieving(context, model, action);
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let ds = await this.performRetrieving(db, context.params.categoryid, context);
            if(ds) {
                return this.createDataTable(KnOperation.RETRIEVE, ds, {});
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async performRetrieving(db: KnDBConnector, categoryid: string, context?: KnContextInfo): Promise<KnRecordSet> {
        if(!categoryid || categoryid.trim().length == 0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select * ");
        knsql.append("from ttokenusage ");
        knsql.append("where createuser = ?userid ");
        knsql.set("userid",this.userToken?.userid);
        this.logger.debug(this.constructor.name+".performRetrieving:",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    protected override async performCreating(context: any, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let now = Utilities.now();
        let authtoken = this.getTokenKey(context);
        context.params.authtoken = authtoken;
        context.params.createmillis = Utilities.currentTimeMillis(now);
        context.params.createdate = now;
        context.params.createtime = Utilities.currentTime(now);
        context.params.createuser = this.userToken?.userid;
        let record = {
            createmillis: context.params.createmillis,
            createdate: context.params.createdate,
            createtime: context.params.createtime,
            tokencount: context.params?.tokencount,
            questionid: context.params?.questionid,
            correlation: context.params?.correlation,
        };
        let rs = await super.performCreating(context, model, db);
        let rcs = this.createRecordSet(rs);
        if(rcs.records>0) {
            rcs.rows = [record];
        }
        return rcs;
    }

    public async save(context: KnContextInfo, quest: QuestInfo, counter: any) : Promise<void> {
        if(!counter) return;
        let tokens = 0;
        if(counter?.totalTokens) tokens = counter.totalTokens;
        if(counter?.totalTokenCount) tokens = counter.totalTokenCount;
        context.params.tokencount = tokens;
        context.params.questionid = quest.questionid;
        context.params.correlation = quest.correlation;
        context.params.agentid = quest.agent && quest.agent.trim().length > 0 ? quest.agent : "GEMINI";
        context.params.modelid = quest.model && quest.model.trim().length > 0 ? quest.model : API_MODEL;
        context.params.categoryid = quest.category;
        context.params.classifyid = quest.classify;
        await this.doCreate(context,this.model);
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

}
