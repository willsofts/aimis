import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknConfigHandler } from "@willsofts/will-serv";

const ConfigService : ServiceSchema = {
    name: "config",
    mixins: [KnService],
    handler: new TknConfigHandler(),
}
export = ConfigService;
