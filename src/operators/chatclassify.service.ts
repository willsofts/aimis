import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { ChatClassifyHandler } from "../question/ChatClassifyHandler";

const ChatClassifyService : ServiceSchema = {
    name: "chatter",
    mixins: [KnService],
    handler: new ChatClassifyHandler(), 
}
export = ChatClassifyService;
