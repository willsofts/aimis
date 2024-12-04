import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuSideBarHandler } from "@willsofts/will-serv";
import { KnModel } from "@willsofts/will-db";
import { MENU_TREE } from "../utils/EnvironmentVariable";

import json_menu from "../../config/menu.json";

class CustomMenuSideBarHandler extends TknMenuSideBarHandler {
    protected override async doHtml(context: any, model: KnModel) : Promise<string> {
        let db = this.getPrivateConnector(model);
        try {
            let userid = context.params.userid || this.userToken?.userid;
            let rs = await this.getSideBarMenu(db, userid, context);
            let rss = this.createRecordSet(rs);
            if(rss.records == 0) {
                rs = await this.getSideBarMenu(db, "user@default", context);
                rss = this.createRecordSet(rs);
            }
            if(rss.records == 0) {
                rs = {rows: json_menu, columns: null};
                rss = this.createRecordSet(rs);
            }
            let ds = this.createSideBarMenu(rss);
            return await this.buildHtml("/views/menu/side.ejs", { dataset: ds, meta: {MENU_TREE: MENU_TREE} }, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }
}

const MenuSideBarService : ServiceSchema = {
    name: "menuside",
    mixins: [KnService],
    handler: new CustomMenuSideBarHandler(), 
}
export = MenuSideBarService;
