import { ServiceSchema } from "moleculer";
import KnService from "@willsofts/will-db";
import { TknHtmlHandler } from "@willsofts/will-serv";

const HtmlService : ServiceSchema = {
    name: "html",
    mixins: [KnService],
    handler: new TknHtmlHandler(), 
}
export = HtmlService;

