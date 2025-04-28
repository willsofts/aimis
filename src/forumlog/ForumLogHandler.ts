import { v4 as uuid } from 'uuid';
import { KnModel, KnActionQuery, KnOperation } from "@willsofts/will-db";
import { KnResultSet, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '@willsofts/will-serv';
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { QuestInfo } from "../models/QuestionAlias";

export class ForumLogHandler extends TknOperateHandler {
    public section = PRIVATE_SECTION;
    public progid = "forumlog";
    public model : KnModel = { 
        name: "tforumlog", 
        alias: { privateAlias: this.section }, 
        fields: {
            logid: { type: "STRING", key: true, created: true },
            categoryid: { type: "STRING", created: true },
            correlationid: { type: "STRING", created: true },
            questionid: { type: "STRING", created: true },
            classifyid: { type: "STRING", created: true },
            textcontents: { type: "STRING", created: true },
            createmillis: { type: "BIGINT", selected: true, created: true, updated: false, defaultValue: Utilities.currentTimeMillis() },
            createdate: { type: "DATE", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createtime: { type: "TIME", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createuser: { type: "STRING", selected: true, created: true, updated: false, defaultValue: null },
            authtoken: { type: "STRING", selected: false, created: true, updated: false, defaultValue: null },
            categorytitle: { type: "STRING", calculated: true },
            categoryname: { type: "STRING", calculated: true },
        },
        prefixNaming: true
    };

    public override insert(context: KnContextInfo) : Promise<KnResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            //do not call exposeFunctional or track otherwise it circular tracking
            return this.doInsert(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        let token = this.getTokenKey(context);
        let user = this.userToken;
        if(!user) user = await this.getUserTokenInfo(context,true);
        let now = Utilities.now();
        sql.set("logid",uuid());
        sql.set("createdate",now,"DATE");
        sql.set("createtime",now,"TIME");
        sql.set("createmillis",Utilities.currentTimeMillis(now));
        sql.set("createuser",user?.userid);
        sql.set("authtoken",token);
    }

    protected override buildFiltersQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, actions: KnActionQuery): KnSQLInterface {
        if(this.isCollectMode(actions.action)) {
            let params = context.params;
            let counting = "count"==actions.subaction;
            knsql.append(actions.selector);
            if(!counting) {
                knsql.append(", tforum.forumtitle as categorytitle ");
                knsql.append(", tfilterquest.filtername as categoryname ");
            }
            knsql.append(" from ");
            knsql.append(model.name);
            if(!counting) {
                knsql.append(" left join tforum on tforum.forumid = ").append(model.name).append(".categoryid ");
                if(params.categoryname && params.categoryname.trim().length > 0) {
                    knsql.append("and tforum.forumtitle LIKE ?forumtitle ");
                    knsql.set("forumtitle","%"+params.categoryname+"%");
                }
                knsql.append(" left join tfilterquest on tfilterquest.filterid = ").append(model.name).append(".categoryid ");
                if(params.categoryname && params.categoryname.trim().length > 0) {
                    knsql.append("and tfilterquest.filtername LIKE ?filtername ");
                    knsql.set("filtername","%"+params.categoryname+"%");
                }
            }
            let filter = " where ";
            if(params.userid && params.userid.trim().length > 0) {
                knsql.append(filter).append(model.name).append(".createuser LIKE ?userid ");
                knsql.set("userid","%"+params.userid+"%");
                filter = " and ";
            }
            if(params.categoryid && params.categoryid.trim().length > 0) {
                knsql.append(filter).append(model.name).append(".categoryid LIKE ?categoryid ");
                knsql.set("categoryid","%"+params.categoryid+"%");
                filter = " and ";
            }
            if(params.correlationid && params.correlationid.trim().length > 0) {
                knsql.append(filter).append(model.name).append(".correlationid LIKE ?correlationid ");
                knsql.set("correlationid","%"+params.correlationid+"%");
                filter = " and ";
            }
            if(params.datefrom && params.datefrom.trim().length > 0) {
                let datefrom = Utilities.parseDate(params.datefrom);
                if(datefrom) {
                    knsql.append(filter).append(model.name).append(".createdate >= ?fromdate ");
                    knsql.set("fromdate",datefrom);
                    filter = " and ";
                }
            }
            if(params.dateto && params.dateto.trim().length > 0) {
                let dateto = Utilities.parseDate(params.dateto);
                if(dateto) {
                    knsql.append(filter).append(model.name).append(".createdate <= ?todate ");
                    knsql.set("todate",dateto);
                    filter = " and ";
                }
            }
            return knsql;    
        }
        return super.buildFiltersQuery(context, model, knsql, actions);
    }

    public async logging(context: KnContextInfo, quest: QuestInfo, contents: Array<any>) : Promise<KnRecordSet> {
        let result = this.createRecordSet();
        let db = this.getPrivateConnector(this.model);
        try {
            let token = this.getTokenKey(context);
            let user = this.userToken;
            if(!user) user = await this.getUserTokenInfo(context,true);    
            let sql = new KnSQL("insert into ").append(this.model.name).append(" (logid,categoryid,correlationid,questionid,classifyid,textcontents,createmillis,createdate,createtime,createuser,authtoken,remarkcontents) ");
            sql.append("values (?logid,?categoryid,?correlationid,?questionid,?classifyid,?textcontents,?createmillis,?createdate,?createtime,?createuser,?authtoken,?remarkcontents)");
            for(let text of contents) {
                if(typeof text === 'string') {
                    let now = Utilities.now();
                    let millis = Utilities.currentTimeMillis(now);
                    sql.clearParameter();
                    sql.set("logid",uuid());
                    sql.set("categoryid",quest.category);
                    sql.set("correlationid",quest.correlation);
                    sql.set("questionid",quest.questionid);
                    sql.set("classifyid",quest.classify);
                    sql.set("textcontents",text);
                    sql.set("createdate",now,"DATE");
                    sql.set("createtime",now,"TIME");
                    sql.set("createmillis",millis);
                    sql.set("createuser",user?.userid);
                    sql.set("authtoken",token);
                    sql.set("remarkcontents",JSON.stringify(context.params));
                    await sql.executeUpdate(db,context);
                    result.records += 1;    
                } else {
                    if(text?.parts) {
                        for(let part of text.parts) {
                            if(part?.text) {
                                let now = Utilities.now();
                                let millis = Utilities.currentTimeMillis(now);            
                                sql.clearParameter();
                                sql.set("logid",uuid());
                                sql.set("categoryid",quest.category);
                                sql.set("correlationid",quest.correlation);
                                sql.set("questionid",quest.questionid);
                                sql.set("classifyid",quest.classify);
                                sql.set("textcontents",part.text);
                                sql.set("createdate",now,"DATE");
                                sql.set("createtime",now,"TIME");
                                sql.set("createmillis",millis);
                                sql.set("createuser",user?.userid);
                                sql.set("authtoken",token);
                                sql.set("remarkcontents",JSON.stringify(context.params));
                                await sql.executeUpdate(db,context);
                                result.records += 1;                
                            }
                        }
                    }
                }
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            db.close();
        }
        return result;
    }

    public override async getDataSearch(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let rs = await this.doCollecting(context, model);
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, this.progid+"/"+this.progid+"_data");
    }

}
