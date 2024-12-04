import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknPermitHandler } from "@willsofts/will-serv";

const PermitService : ServiceSchema = {
    name: "permit",
    mixins: [KnService],
    handler: new TknPermitHandler(), 
}
export = PermitService;
