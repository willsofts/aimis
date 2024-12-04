import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation, KnActionQuery } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL, KnResultSet } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnValidateInfo, KnContextInfo, KnDataTable } from '@willsofts/will-core';
import { VerifyError } from '@willsofts/will-core';
import { KnPageUtility } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '@willsofts/will-serv';
import { AuthenToken } from '@willsofts/will-lib';
import { KnUserAccessInfo } from "@willsofts/will-core";
import { KnUserToken } from "@willsofts/will-core";
import { TknSigninTokenHandler } from '@willsofts/will-core';
import { MAX_EXPIRE_DATE } from "../utils/EnvironmentVariable";

export class Sftu004Handler extends TknOperateHandler {

    public progid = "sftu004";
    public model : KnModel = { 
        name: "tpasskey", 
        alias: { privateAlias: this.section }, 
        fields: {
            keyid: { type: "STRING", key: true, created: true },
            keyname: { type: "STRING", created: true },
            keypass: { type: "STRING", created: true, updated: false },
            site: { type: "STRING", created: true, updated: false },
            userid: { type: "STRING", created: true, updated: false },
            createdate: { type: "DATE", created: true, updated: false },
            createtime: { type: "TIME", created: true, updated: false },
            createmillis: { type: "BIGINT", created: true, updated: false },
            createuser: { type: "STRING", created: true, updated: false },
            expireflag: { type: "STRING", created: true, updated: false, defaultValue: "0" },
            expireday: { type: "INTEGER", created: true, updated: false },
            expiredate: { type: "DATE", created: true, updated: false },
            expiretime: { type: "TIME", created: true, updated: false },
            expiretimes: { type: "BIGINT", created: true, updated: false },            
            editdate: { type: "DATE", selected: false, created: true, updated: true },
            edittime: { type: "TIME", selected: false, created: true, updated: true },
            edituser: { type: "STRING", selected: false, created: true, updated: true },
        },
        //prefix naming with table name when select ex. table.column1,table.column2,...
        prefixNaming: true
    };

    /* try to assign individual parameters under this context */
    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        let now = Utilities.now();
        sql.set("editdate",now,"DATE");
        sql.set("edittime",now,"TIME");
        sql.set("edituser",this.userToken?.userid);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi : KnValidateInfo = {valid: true};
        let page = new KnPageUtility(this.progid, context);
        if(page.isInsertMode(action)) {
            vi = this.validateParameters(context.params,"keyname");
            if(vi.valid) {
                if((!this.userToken?.site || this.userToken?.site.trim().length==0) || (!this.userToken?.userid || this.userToken?.userid.trim().length==0)) {
                    vi = {valid: false, info: "Invalid user token"};
                }
            }
        } else {
            vi = this.validateParameters(context.params,"keyid");
        }
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFiltersQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, actions: KnActionQuery): KnSQLInterface {
        if(this.isCollectMode(actions.action)) {
            let params = context.params;
            knsql.append(actions.selector);
            knsql.append(" from ");
            knsql.append(model.name);
            knsql.append(" where site = ?site and userid = ?userid ");
            knsql.set("site",this.userToken?.site);
            knsql.set("userid",this.userToken?.userid);
            if(params.keyname && params.keyname!="") {
                knsql.append("and keyname LIKE ?keyname ");
                knsql.set("keyname","%"+params.keyname+"%");
            }
            if(params.fromdate && params.fromdate!="") {
                let fromdate = Utilities.parseDate(params.fromdate);
                if(fromdate) {
                    knsql.append("and createdate >= ?fromdate ");
                    knsql.set("fromdate",fromdate);
                }
            }
            if(params.todate && params.todate!="") {
                let todate = Utilities.parseDate(params.todate);
                if(todate) {
                    knsql.append("and createdate <= ?todate ");
                    knsql.set("todate",todate);
                }
            }
            return knsql;    
        }
        return super.buildFiltersQuery(context, model, knsql, actions);
    }

    protected override async doCategories(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performCategories(context, model, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			try { if(db) db.close(); } catch(er) { console.error(er); }
        }
    }

    protected async performCategories(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnDataTable> {
        let settings = this.getCategorySetting(context, "tkexpire");
        return await this.getDataCategories(context, db, settings);
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                return this.createDataTable(KnOperation.RETRIEVE, row);
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			try { if(db) db.close(); } catch(er) { console.error(er); }
        }
    }

    protected async performRetrieving(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select * from tpasskey ");
        knsql.append("where keyid = ?keyid ");
        knsql.set("keyid",context.params.keyid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }
    
    /**
     * Override for search action (return data collection)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataSearch(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let rs = await this.doCollecting(context, model);
        if(rs && rs.rows.length > 0) {
            let now = new Date();
            let curtimes = now.getTime();
            for(let row of rs.rows) {
                row.expired = "";
                if(curtimes > row.expiretimes) {
                    row.expired = '<em class="fa fa-check-square-o alert-color" aria-hidden="true"></em>';
                }
            }
        }
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sftu004/sftu004_data");
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
            let rs =  await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                if(row.expireflag=="1") {
                    row.expiredate = "";
                    row.expiretime = "";
                    row.expireday = "";
                }
                let dt = await this.performCategories(context, model, db);
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sftu004/sftu004_dialog");
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			try { if(db) db.close(); } catch(er) { console.error(er); }
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
        dt.renderer = "sftu004/sftu004_dialog";
        dt.dataset["keyid"] = uuid();
        dt.dataset["expireflag"] = "0";
        dt.dataset["expireday"] = "30";
        return dt;
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
        if(!this.userToken) return this.createRecordSet();
        let expireins = 0;
        let expireflag = context.params.expireflag;
        if(!expireflag) expireflag = "0";
        let expireday = Number(context.params.expireday);
        if(!expireday || expireday<=0) expireday = 30;
        let expiredays = expireday+"d";
        let msperday = 24*60*60*1000;
        let now = Utilities.now();
        if("0"==expireflag) {
            expireins = expireday*msperday;
        } else {            
            let maxdate = Utilities.parseDate(MAX_EXPIRE_DATE);
            if(!maxdate) maxdate = Utilities.parseDate("31/12/9000");            
            expireins = (maxdate as Date).getTime() - now.getTime();
            expireday = Math.round(expireins / msperday);
            expiredays = expireday+"d";
        }
        let expiredate = new Date(now.getTime() + expireins);
        let record = {
            keyid: context.params.keyid || uuid(),
            keyname: context.params.keyname,
            keypass: "",
            site: this.userToken?.site,
            userid: this.userToken?.userid,
            createdate: now,
            createtime: Utilities.currentTime(now),
            createmillis: now.getTime(),
            createuser: this.userToken?.userid,
            expireflag: expireflag,
            expireday: expireday,
            expiredate: expiredate,
            expiretime: Utilities.currentTime(expiredate),
            expiretimes: 0,
        };
        this.logger.debug(this.constructor.name+".performCreating: record",record);
        let usrinfo: KnUserAccessInfo = { userid: this.userToken.userid as string, site: this.userToken?.site };
        let usrtoken = await this.createUserAccess(db, usrinfo, {keyid: record.keyid, expireins: expireins, expiredays: expiredays}, context);
        this.logger.debug(this.constructor.name+".performCreating: token",usrtoken);
        record.expiretimes = usrtoken.expiretimes;
        record.keypass = usrtoken.authtoken;
        this.logger.debug(this.constructor.name+".performCreating: record",record);
        let knsql = this.buildInsertQuery(context, model, KnOperation.CREATE);
        await this.assignParameters(context,knsql,KnOperation.CREATE,KnOperation.CREATE);
        knsql.set("keyid",record.keyid);
        knsql.set("keyname",record.keyname);
        knsql.set("keypass",usrtoken.authtoken);
        knsql.set("site",this.userToken?.site);
        knsql.set("userid",this.userToken?.userid);
        knsql.set("createdate",now,"DATE");
        knsql.set("createtime",now,"TIME");
        knsql.set("createmillis",now.getTime());
        knsql.set("createuser",this.userToken?.userid);
        knsql.set("expireflag",expireflag);
        knsql.set("expireday",expireday);
        knsql.set("expiredate",expiredate,"DATE");
        knsql.set("expiretime",expiredate,"TIME");
        knsql.set("expiretimes",record.expiretimes);
        let rs = await knsql.executeUpdate(db,context);
        let rcs = this.createRecordSet(rs);
        if(rcs.records>0) {
            rcs.rows = [record];
        }
        return rcs;
    }
    
    public async createUserAccess(db: KnDBConnector, usrinfo: KnUserAccessInfo, record: any, context?: any) : Promise<KnUserToken> {
        let useruuid = record.keyid;
        let authdata = {identifier:useruuid, site:usrinfo.site, accessor:usrinfo.userid, type: "G"};
        let authtoken = AuthenToken.createAuthenToken(authdata, record.expiredays);
        let handler = new TknSigninTokenHandler();
        handler.obtain(this.broker,this.logger);
        return handler.createUserToken(db, usrinfo, useruuid, authtoken, "G", record.expireins, context);
    }

}
