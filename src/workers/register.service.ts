import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknRegisterHandler } from "@willsofts/will-serv";

const RegisterService : ServiceSchema = {
    name: "register",
    mixins: [KnService],
    handler: new TknRegisterHandler(), 
}
export = RegisterService;

