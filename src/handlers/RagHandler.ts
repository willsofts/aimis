import { HTTP } from "@willsofts/will-api";
import { TknOperateHandler } from '@willsofts/will-serv';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { KnContextInfo } from '@willsofts/will-core';
import { OPERATE_HANDLERS } from '@willsofts/will-serv';
import { PRIVATE_SECTION, RAG_API_KEY, RAG_API_KEY_SYNC_VALIDATE } from "../utils/EnvironmentVariable";

/**
 * This api implement for web hoook by rag service in order to update active document when async call to rag service
 */
export class RagHandler extends TknOperateHandler {
    public section = PRIVATE_SECTION;
    public progid = "rag";
    public model : KnModel = { 
        name: "trag", 
        alias: { privateAlias: this.section }, 
    }

    public handlers = OPERATE_HANDLERS.concat([ {name: "sync"} ]);

    public async sync(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "sync", raw: false}, this.doSync);
    }

    public async doSync(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.UPDATE);
        let rs = await this.doUpdate(context, model);
        return await this.createCipherData(context, KnOperation.UPDATE, rs);
    }

    protected override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        /* expected: {
            libraryId: string,
            ingestStatus: string (Completed/Failed)
        } */
		this.logger.debug(this.constructor.name+".doUpdate: params",context.params,"headers",context.meta?.headers);
		let library_id = context.params.libraryId;
        if(!library_id || library_id.trim().length == 0) return this.createRecordSet();
        let apikey = context.meta?.headers["x-api-key"];
        if(RAG_API_KEY_SYNC_VALIDATE && (apikey != RAG_API_KEY)) return this.createRecordSet();        
        let note = JSON.stringify(context.params);
        let active = "1";
        let status = context.params.ingestStatus;
        if(status && status != "Completed") {
            active = "0";
        }
        let id = library_id.replaceAll('_','-');
        let result = this.createRecordSet();
		let db = this.getPrivateConnector(model);
		try {
			let knsql = new KnSQL();
			knsql.append("update tforum set ragactive = ?ragactive, ragremark = ?ragremark where forumid = ?forumid ");
			knsql.set("forumid",id);
			knsql.set("ragactive",active);
			knsql.set("ragremark",note);
            this.logger.debug(this.constructor.name+".doUpdate: ",knsql);            
			let rs = await knsql.executeUpdate(db, context);
            let rss = this.createRecordSet(rs);
            result.records += rss.records;
            knsql.clear();
            knsql.append("update tsummarydocument set ragactive = ?ragactive, ragremark = ?ragremark ");
            knsql.append("where summaryid = ?summaryid ");
            knsql.set("summaryid",id);
            knsql.set("ragactive",active);
            knsql.set("ragremark",note);
            this.logger.debug(this.constructor.name+".doUpdate: ",knsql);
            rs = await knsql.executeUpdate(db,context);
            rss = this.createRecordSet(rs);
            result.records += rss.records;
            return result;
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
			return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}

    }

}
