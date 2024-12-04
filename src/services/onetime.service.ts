import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknOneTimeHandler } from "@willsofts/will-core";

const OneTimeService : ServiceSchema = {
    name: "onetime",
    mixins: [KnService],
    handler: new TknOneTimeHandler(), 
}
export = OneTimeService;
