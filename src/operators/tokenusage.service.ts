import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TokenUsageHandler } from "../tokenusage/TokenUsageHandler";

const TokenUsageService : ServiceSchema = {
    name: "tokenusage",
    mixins: [KnService],
    handler: new TokenUsageHandler(), 
}
export = TokenUsageService;
