import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { FilterQuestHandler } from "./FilterQuestHandler";

/**
 * This for gui launch when view record
 */
class FilterQuestViewHandler extends FilterQuestHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        try {
            return await this.getDataView(context, model);
        } catch(ex: any) {
            if(this.isRecordNotFound(ex)) {
                let ds = this.emptyDataSet();
                return this.createDataTable(KnOperation.VIEW, ds, {}, "pages/notinfo"); 
            }
            throw ex;
        }
    }

}

export = new FilterQuestViewHandler();
