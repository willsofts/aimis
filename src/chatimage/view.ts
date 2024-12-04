import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { ChatImageHandler } from "../question/ChatImageHandler";

/**
 * This for gui launch when new record
 */
class ChatImageViewHandler extends ChatImageHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context,model)
    }

}

export = new ChatImageViewHandler();
