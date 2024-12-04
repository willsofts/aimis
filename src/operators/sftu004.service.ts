import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sftu004Handler } from "../sftu004/Sftu004Handler";

const Sftu004Service : ServiceSchema = {
    name: "sftu004",
    mixins: [KnService],
    handler: new Sftu004Handler(), 
}
export = Sftu004Service;
