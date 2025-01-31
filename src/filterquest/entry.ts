import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { FilterQuestHandler } from "./FilterQuestHandler";

/**
 * This for gui launch when new record
 */
class FilterQuestEntryHandler extends FilterQuestHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataEntry(context, model);
    }

}

export = new FilterQuestEntryHandler();
