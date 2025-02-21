import { ServiceSchema } from "moleculer";

const messages = require("../../config/message.json");

const MessageService : ServiceSchema = {
    name: "message",
    actions: {
        async get(ctx) {
            ctx.meta.$responseRaw = "true";
            return messages;
        },
    }    
}
export = MessageService;
