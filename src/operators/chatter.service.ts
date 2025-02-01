import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { ChatterHandler } from "../question/ChatterHandler";

const ChatterService : ServiceSchema = {
    name: "chatter",
    mixins: [KnService],
    handler: new ChatterHandler(), 
}
export = ChatterService;
