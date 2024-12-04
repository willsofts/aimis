import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknDataServiceHandler } from "@willsofts/will-serv";

const DataServiceService : ServiceSchema = {
    name: "dataservice",
    mixins: [KnService],
    handler: new TknDataServiceHandler(), 
}
export = DataServiceService;
