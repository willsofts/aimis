import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnResultSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { VerifyError, KnValidateInfo, KnContextInfo, KnDataTable, KnPageUtility, KnDataSet, KnDataEntity } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler, OPERATE_HANDLERS } from '@willsofts/will-serv';
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { ForumHandler } from "../forum/ForumHandler";

export const PREFIX_PROMPT = "Try to classify the question into the following categories:";
export const JSON_PROMPT = `After classified the question then answer in JSON data with the following format (with out mark down code and double quote on key attributes):
    {
        "category_name": "The category_name found from defined categories ex. 'Category1', but if not found then let null",
        "category_feedback": "In case of not found from defined categories then try to feedback by answer the question ex. your question out of scope, otherwise let it null",
    }
`;

export class FilterQuestHandler extends TknOperateHandler {
    public section = PRIVATE_SECTION;
    public progid = "filterquest";
    public model : KnModel = { 
        name: "tfilterquest", 
        alias: { privateAlias: this.section }, 
        fields: {
            filterid: { type: "STRING", key: true },
            filtername: { type: "STRING" },
            agentid: { type: "STRING" },
            prefixprompt: { type: "STRING" },
            suffixprompt: { type: "STRING" },
            jsonprompt: { type: "STRING", updated: true },
            skillprompt: { type: "STRING", updated: true },
            hookflag: { type: "STRING", updated: true, defaultValue: "0" },
            webhook: { type: "STRING", updated: true },
            shareflag: { type: "STRING", selected: true, created: true, updated: true, defaultValue: "0" },
            createdate: { type: "DATE", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createtime: { type: "TIME", selected: true, created: true, updated: false, defaultValue: Utilities.now() },
            createmillis: { type: "BIGINT", selected: true, created: true, updated: false, defaultValue: Utilities.currentTimeMillis() },
            createuser: { type: "STRING", selected: false, created: true, updated: false, defaultValue: null },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: Utilities.now() },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: Utilities.now() },
            editmillis: { type: "BIGINT", selected: false, created: true, updated: true, defaultValue: Utilities.currentTimeMillis() },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null },
            forumcategories: { type: "STRING" , calculated: true },
        },
        prefixNaming: true
    };

    public handlers = OPERATE_HANDLERS.concat([ {name: "forum"}, {name: "forumupdate"} ]);

    public async forum(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "forum", raw: false}, this.doForum);
    }

    public async forumupdate(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "forum", raw: false}, this.doForumUpdate);
    }

    public async doForum(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doForumGetting(context, model, KnOperation.GET);
        return await this.createCipherData(context, KnOperation.GET, rs);
    }

    public async doForumUpdate(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doForumUpdating(context, model, KnOperation.GET);
        return await this.createCipherData(context, KnOperation.GET, rs);
    }

    protected async doForumGetting(context: KnContextInfo, model: KnModel, action: string = KnOperation.GET) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.getForumInfo(db, context.params.forumid,context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    protected async doForumUpdating(context: KnContextInfo, model: KnModel, action: string = KnOperation.GET) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performForumUpdating(db,context.params.forumid,context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    /* try to assign individual parameters under this context */
    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        let now = Utilities.now();
        sql.set("jsonprompt", context.params.jsonprompt || null);
        sql.set("createuser",this.userToken?.userid);
        sql.set("editmillis",Utilities.currentTimeMillis(now));
        sql.set("editdate",now,"DATE");
        sql.set("edittime",now,"TIME");
        sql.set("edituser",this.userToken?.userid);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi : KnValidateInfo = {valid: true};
        let page = new KnPageUtility(this.progid, context);
        if(page.isInsertMode(action)) {
            vi = this.validateParameters(context.params,"filtername");
        } else {
            vi = this.validateParameters(context.params,"filterid");
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
                knsql.append(filter).append(" ( createuser = ?userid or createuser is null or shareflag = '1' ) ");
                knsql.set("userid",this.userToken?.userid);
                filter = " and ";    
            }
            if(params.filtername && params.filtername!="") {
                knsql.append(filter).append("filtername LIKE ?filtername");
                knsql.set("filtername","%"+params.filtername+"%");
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
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected override async doGet(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        await this.validateRequireFields(context, model, KnOperation.GET);
        let rs = await this.doGetting(context, model, KnOperation.GET);
        return await this.createCipherData(context, KnOperation.GET, rs);
    }

    protected override async doCategories(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performCategories(context, model, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async performCategories(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnDataTable> {
        let settings = [{tableName:"tagent", keyField:"agentid", orderFields:"seqno", addonFields:"seqno", setting: { categoryName: "tagent", keyName: "agentid", valueNames: ["nameen"]} }];
        let datacategory = await this.getDataCategories(context, db, settings);
        let entity = datacategory.entity as KnDataEntity;
        if(!entity.tagent || Object.keys(entity.tagent).length ==0) {
            entity.tagent = {"GEMINI":"GEMINI"};
        }
        entity.tforum = [];
        let rs = await this.getForumList(db,context);
        if(rs && rs.rows.length>0) {
            entity.tforum = rs.rows;
            /*
            rs.rows.forEach((item:any) => {
                entity.tforum[item.forumid] = item.forumtitle;
            });*/
        }
        return datacategory;
    }

    protected async doGetting(context: KnContextInfo, model: KnModel, action: string = KnOperation.GET): Promise<KnDataTable> {
        return this.doRetrieving(context, model, action);
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let ds = await this.performRetrieveDataSet(db, context.params.filterid, context);
            if(ds) {
                let dt = await this.performCategories(context, model, db);
                return this.createDataTable(KnOperation.RETRIEVE, ds, dt.entity);
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async performRetrieveDataSet(db: KnDBConnector, filterid: string, context?: KnContextInfo) : Promise<KnDataSet | undefined> {
        let rs = await this.performRetrieving(db, filterid, context);
        if(rs.rows.length>0) {
            return await this.retrieveDataSet(db, filterid, rs, context);
        }
        return undefined;
    }

    public async performRetrieving(db: KnDBConnector, filterid: string, context?: KnContextInfo): Promise<KnRecordSet> {
        if(!filterid || filterid.trim().length == 0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select * ");
        knsql.append("from tfilterquest ");
        knsql.append("where filterid = ?filterid ");
        knsql.set("filterid",filterid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async retrieveDataSet(db: KnDBConnector, filterid: string, rs: KnRecordSet, context?: KnContextInfo) : Promise<KnDataSet> {
        let row = this.transformData(rs.rows[0]);
        let ars = await this.getForumInGroup(db, filterid, context);
        if(ars.rows.length > 0) {
            let categories = ars.rows.map((item:any) => item.forumid);
            row["forumcategories"] = categories;
            row["categories"] = categories.join(",");
            row["forumlists"] = ars.rows;
        }
        let questions = [];
        let handler = new ForumHandler();
        handler.obtain(this.broker,this.logger);
        let qrs = await handler.performQuestionGetting(db, filterid, context);
        if(qrs && qrs.rows.length>0) {
            for(let i=0; i<qrs.rows.length; i++) {
                questions.push(qrs.rows[i].question);                    
            }
        }
        row.questions = questions;
        return row;
    }

    public async getFilterQuestConfig(db: KnDBConnector, filterid: string, context?: KnContextInfo) : Promise<KnDataSet | undefined> {
        return await this.performRetrieveDataSet(db,filterid,context);
    }

    public async getForumList(db: KnDBConnector, context?: KnContextInfo): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select forumid,forumgroup,forumtitle ");
        knsql.append("from tforum ");
        knsql.append("where forumgroup in ('DB','NOTE') ");
        knsql.append("and (createuser = ?createuser or createuser is null or shareflag = '1') ");
        knsql.set("createuser",this.userToken?.userid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async getForumInfo(db: KnDBConnector, forumid: string, context?: KnContextInfo): Promise<KnRecordSet> {
        if(!forumid || forumid.trim().length == 0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select * ");
        knsql.append("from tforum ");
        knsql.append("where forumid = ?forumid ");
        knsql.set("forumid",forumid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async performForumUpdating(db: KnDBConnector, forumid: string, context: KnContextInfo): Promise<KnRecordSet> {
        if(!forumid || forumid.trim().length == 0) return this.createRecordSet();
        let hookflag = "0";
        if(context.params.hookflag && context.params.hookflag.trim().length>0) hookflag = context.params.hookflag;
        let now = Utilities.now();
        let knsql = new KnSQL();
        knsql.append("update tforum set classifyprompt=?classifyprompt, hookflag=?hookflag, webhook=?webhook, ");
        knsql.append("editdate=?editdate, edittime=?edittime, ");
        knsql.append("editmillis=?editmillis, edituser=?edituser ");
        knsql.append("where forumid = ?forumid ");
        knsql.set("forumid",forumid);
        knsql.set("hookflag",hookflag);
        knsql.set("webhook",context.params.webhook);
        knsql.set("classifyprompt",context.params.classifyprompt);
        knsql.set("editdate",now,"DATE");
        knsql.set("edittime",now,"TIME");
        knsql.set("editmillis",Utilities.currentTimeMillis(now));
        knsql.set("edituser",this.userToken?.userid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }
    
    public async getForumInGroup(db: KnDBConnector, filterid: string, context?: KnContextInfo): Promise<KnRecordSet> {
        if(!filterid || filterid.trim().length == 0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select tfilterquestforum.forumid,tforum.forumgroup,tforum.classifyprompt ");
        knsql.append("from tfilterquestforum, tforum ");
        knsql.append("where tfilterquestforum.filterid = ?filterid ");
        knsql.append("and tfilterquestforum.forumid = tforum.forumid ");
        knsql.set("filterid",filterid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async getRecordInfo(db: KnDBConnector, filterid: string, context?: KnContextInfo, model: KnModel = this.model) : Promise<KnDataSet | undefined> {
        try {
            return await this.performRetrieveDataSet(db, filterid, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        }
    }

    protected override async doInserting(context: KnContextInfo, model: KnModel): Promise<KnDataTable> {
        let rs = await this.doCreating(context, model);
        if(rs && rs.rows.length>0) {
            let row = this.transformData(rs.rows[0]);
            return this.createDataTable(KnOperation.INSERT, row);
        }
        return this.createDataTable(KnOperation.INSERT);
    }

    protected override async performCreating(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let now = Utilities.now();
        let id = context.params.filterid;
        if(!id || id.trim().length == 0) id = uuid();
        let record = {
            filterid: id,
            createmillis: Utilities.currentTimeMillis(now),
            createdate: now,
            createtime: Utilities.currentTime(now),
        };
        context.params.filterid = record.filterid;
        let handler = new ForumHandler();
        handler.obtain(this.broker,this.logger);
        await handler.insertQuestions(context, db, record.filterid);
        await this.insertForumInGroup(context, db, record.filterid);
        let knsql = this.buildInsertQuery(context, model, KnOperation.CREATE);
        await this.assignParameters(context,knsql,KnOperation.CREATE,KnOperation.CREATE);
        knsql.set("filterid",record.filterid);
        knsql.set("filtername",context.params.filtername); 
        knsql.set("agentid",context.params.agentid || "GEMINI"); 
        knsql.set("prefixprompt",context.params.prefixprompt); 
        knsql.set("suffixprompt",context.params.suffixprompt); 
        knsql.set("jsonprompt",context.params.jsonprompt); 
        knsql.set("skillprompt",context.params.skillprompt); 
        knsql.set("createmillis",record.createmillis);
        knsql.set("createdate",record.createdate,"DATE");
        knsql.set("createtime",record.createtime,"TIME");
        knsql.set("createuser",this.userToken?.userid);
        let rs = await knsql.executeUpdate(db,context);
        let rcs = this.createRecordSet(rs);
        if(rcs.records>0) {
            rcs.rows = [record];
        }
        return rcs;
    }

    protected async insertForumInGroup(context: KnContextInfo, db: KnDBConnector, filterid: string) : Promise<KnRecordSet> {
        let result : KnRecordSet = { records: 0, rows: [], columns: []};
        await this.deleteForumInGroup(db, filterid, context);
        let categories = this.getParameterArray("forumcategories",context.params);
        if(categories && Array.isArray(categories) && categories.length>0) {
            let knsql = new KnSQL();
            knsql.append("insert into tfilterquestforum(filterid,forumid) values(?filterid,?forumid) ");
            for(let i=0; i<categories.length; i++) {
                let categoryid = categories[i];
                if(categoryid.trim().length>0) {
                    knsql.set("filterid",filterid);
                    knsql.set("forumid",categoryid);
                    let rs = await knsql.executeUpdate(db,context);
                    let res = this.createRecordSet(rs);
                    result.records += res.records;
                }
            }
        }
        return result;
    }

    protected async deleteForumInGroup(db: KnDBConnector, filterid: string, context?: KnContextInfo) : Promise<KnResultSet> {
        if(!filterid || filterid.trim().length == 0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("delete from tfilterquestforum where filterid = ?filterid ");
        knsql.set("filterid",filterid);
        return await knsql.executeUpdate(db,context);
    }

    protected override async performUpdating(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let handler = new ForumHandler();
        handler.obtain(this.broker,this.logger);
        await handler.insertQuestions(context, db, context.params.filterid);
        await this.insertForumInGroup(context, db, context.params.filterid);
        return super.performUpdating(context, model, db);
    }

    protected async performClearing(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let handler = new ForumHandler();
        handler.obtain(this.broker,this.logger);
        await handler.deleteQuestions(context, db, context.params.filterid);
        await this.deleteForumInGroup(db, context.params.filterid, context);
        return super.performClearing(context, model, db);
    }

    protected override async doList(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performListing(context, model, db);
            if(rs.rows.length>0) {
                let hasselected = false;
                let firstforum = rs.rows[0].filterid;
                let ds : KnDataSet = { };
                for(let i=0; i<rs.rows.length; i++) {
                    let row = rs.rows[i];
                    ds[row.filterid] = { title : row.filtername, selected: "1"==row.forumselected };
                    if(ds[row.filterid].selected) hasselected = true;
                    let qrs = await this.performQuestionGetting(context, db, row.filterid);
                    if(qrs.rows.length>0) {
                        ds[row.filterid].questions = qrs.rows;
                    }
                }
                if(!hasselected) { ds[firstforum].selected = true; }
                return this.createDataTable(KnOperation.LIST, ds);
            }
            return this.createDataTable(KnOperation.LIST);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    protected async performQuestionGetting(context: KnContextInfo, db: KnDBConnector, forumid: string): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select seqno,question ");
        knsql.append("from tforumquest ");
        knsql.append("where forumid = ?forumid ");
        knsql.append("order by seqno ");
        knsql.set("forumid",forumid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    protected async performListing(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select filterid,filtername,createmillis ");
        knsql.append("from tfilterquest ");
        knsql.append("where ( createuser = ?userid or createuser is null or shareflag = '1' ) ");
        knsql.append("order by createmillis ");
        knsql.set("userid",this.userToken?.userid);
        this.logger.debug(this.constructor.name+".performListing",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    /* override to handle launch router when invoked from menu */
    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let dt = await this.performCategories(context, model, db);
            dt.action = KnOperation.EXECUTE;
            return dt;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
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
            let ds = await this.performRetrieveDataSet(db, context.params.filterid, context);
            if(ds) {
                let dt = await this.performCategories(context, model, db);
                return this.createDataTable(KnOperation.RETRIEVAL, ds, dt.entity, this.progid+"/"+this.progid+"_dialog");
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
        let dt = await this.doCategories(context, model);
        dt.action = KnOperation.ADD;
        dt.renderer = this.progid+"/"+this.progid+"_dialog";
        dt.dataset["filterid"] = uuid();
        dt.dataset["jsonprompt"] = JSON_PROMPT;
        return dt;
    }

    public override async getDataEntry(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let meta = { showtitle : true };
        if(context.params.showtitle=="false") meta.showtitle = false;
        let dt = await this.getDataAdd(context, model);
        dt.renderer = this.progid+"/"+this.progid+"_edit";
        dt.meta = meta;
        return dt;
    }    

    public override async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let meta = { showtitle : true };
        if(context.params.showtitle=="false") meta.showtitle = false;
        let dt = await this.getDataRetrieval(context, model);
        dt.renderer = this.progid+"/"+this.progid+"_edit";
        dt.meta = meta;
        return dt;
    }    

}
