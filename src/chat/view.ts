import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { ChatHandler } from "../question/ChatHandler";

/**
 * This for gui launch when new record
 */
class ChatViewHandler extends ChatHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context,model)
    }

}

export = new ChatViewHandler();
