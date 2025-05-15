import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { RagHandler } from "../handlers/RagHandler";

const RagService : ServiceSchema = {
    name: "rag",
    mixins: [KnService],
    handler: new RagHandler(), 
}
export = RagService;
