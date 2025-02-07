import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { ChatterHandler } from "../question/ChatterHandler";

/**
 * This for gui launch when new record
 */
class ChatterViewHandler extends ChatterHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context,model)
    }

}

export = new ChatterViewHandler();
