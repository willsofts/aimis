import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { ChatNoteHandler } from "../question/ChatNoteHandler";

/**
 * This for gui launch when new record
 */
class ChatNoteViewHandler extends ChatNoteHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context,model)
    }

}

export = new ChatNoteViewHandler();
