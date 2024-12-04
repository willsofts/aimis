import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { ChatDOCHandler } from "../question/ChatDOCHandler";

/**
 * This for gui launch when new record
 */
class ChatDOCViewHandler extends ChatDOCHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context,model)
    }

}

export = new ChatDOCViewHandler();
