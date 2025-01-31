import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { FilterQuestHandler } from "../filterquest/FilterQuestHandler";

const FilterQuestService : ServiceSchema = {
    name: "filterquest",
    mixins: [KnService],
    handler: new FilterQuestHandler(), 
}
export = FilterQuestService;
