import { KnModel } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnResultSet } from "@willsofts/will-sql";
import { KnContextInfo } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '@willsofts/will-serv';
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { QuestInfo } from "../models/QuestionAlias";

export class UsageHandler extends TknOperateHandler {
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
            tokencount: { type: "BIGINT" },
            questionid: { type: "STRING" },
            correlation: { type: "STRING" },
        }
    };

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
        context.params.agentid = quest.agent;
        context.params.modelid = quest.model;
        context.params.categoryid = quest.category;
        await this.doCreate(context,this.model);
    }

}
