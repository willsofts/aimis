import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { ChatPDFHandler } from "../question/ChatPDFHandler";

/**
 * This for gui launch when new record
 */
class ChatPDFViewHandler extends ChatPDFHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context,model)
    }

}

export = new ChatPDFViewHandler();
