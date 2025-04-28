import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { ForumLogHandler } from "../forumlog/ForumLogHandler";

const ForumLogService : ServiceSchema = {
    name: "forumlog",
    mixins: [KnService],
    handler: new ForumLogHandler(), 
}
export = ForumLogService;
