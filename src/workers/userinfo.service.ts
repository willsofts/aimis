import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknUserInfoHandler } from "@willsofts/will-serv";

const UserInfoService : ServiceSchema = {
    name: "userinfo",
    mixins: [KnService],
    handler: new TknUserInfoHandler(), 
}
export = UserInfoService;

