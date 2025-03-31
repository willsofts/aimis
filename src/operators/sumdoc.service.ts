import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { SumDocHandler } from "../sumdoc/SumDocHandler";

const SumDocService : ServiceSchema = {
    name: "sumdoc",
    mixins: [KnService],
    handler: new SumDocHandler(), 
}
export = SumDocService;
