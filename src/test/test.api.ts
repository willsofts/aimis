import { QuestionHandler } from "../question/QuestionHandler";
import { ForumConfig } from "../models/QuestionAlias";
import { Arguments } from "@willsofts/will-util";

const args = process.argv.slice(2);
let coid = Arguments.getString(args,"12345","-id","--coid") as string;
let qid = Arguments.getString(args,"12345","-qid","--quest") as string;
let cat = Arguments.getString(args,"TEST","-cat","--category") as string;
const input = Arguments.getString(args,"select * from tdialect","-input") as string;
const forum : ForumConfig = {
    type: "API",     
    api: "http://localhost:8080/api/inquiry/inquire",
    caption: "Forum",
    title: "Inquire",
    tableinfo : "",
    schema: "AIDB",
    alias: "mysql2",
    dialect: "mysql",
    url: "",
    user: "",
    password: "",
    host: "localhost",
    port: 3306,
    version: "",
    webhook: "",
    hookflag: "",
    ragasync: false,
};
const handler = new QuestionHandler();
handler.processAPI(input,cat,{correlation:coid,questionid:qid,question:"",mime:"",image:"",category:cat},forum).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});
