import { v4 as uuid } from 'uuid';
import { ServiceSchema } from "moleculer";
import { JSONReply } from "@willsofts/will-api";
import { Utilities, Configure } from "@willsofts/will-util";
var os = require("os");

const packageconfig = require("../../package.json");

const FetchService : ServiceSchema = {
    name: "fetch",
    actions: {
        greet(ctx: any) {
            let pname = ctx.params.name;
            let response: JSONReply = new JSONReply();
            response.head.modeling("ensure","greet");
            response.head.composeNoError();
            response.body = { message : "Greet "+(pname==null?"world":pname) };
            return response;
        },
        hello(ctx: any) {
            let pname = ctx.params.name;
            let response: JSONReply = new JSONReply();
            response.head.modeling("ensure","hello");
            response.head.composeNoError();
            response.body = { message : "Hello "+(pname==null?"world":pname) };
            return response;
        },
        hi(ctx: any) {
            let pname = ctx.params.name;
            let response: JSONReply = new JSONReply();
            response.head.modeling("ensure","hi");
            response.head.composeNoError();
            response.body = { "message" : "hi "+(pname==null?"world":pname) };
            return response;
        },
        error(ctx: any) {
            return Promise.reject("Test Error");
        },
        time(ctx: any) {
            let pname = ctx.params.name;
            let response: JSONReply = new JSONReply();
            response.head.modeling("ensure","fetch");
            response.head.composeNoError();
            let body : Map<string,string> = new Map();
            let d = new Date();
            body.set("datetime", Utilities.getDateNow(d)+" "+Utilities.getTimeNow(d) );
            if(pname && pname=="current") {
                body.set("result", ""+d.getTime());
            } else if(pname && pname=="date") {
                body.set("result", ""+Utilities.getDateNow(d));
            } else if(pname && pname=="time") {
                body.set("result", ""+Utilities.getTimeNow(d));		
            } else if(pname && pname=="datetime") {
                body.set("result", Utilities.getDateNow(d)+" "+Utilities.getTimeNow(d)); 
            }
            response.body = Object.fromEntries(body);
            return response;
        },
        config(ctx: any) {
            let pname = ctx.params.name;
            let response: JSONReply = new JSONReply();
            response.head.modeling("ensure","config");
            response.head.composeNoError();
            let body : Map<string,string> = new Map();
            if("reload"==pname) {
                Configure.reloadConfig();		
            } else {
                let result = Configure.getConfig(pname);
                if(result) {
                    body.set("config",result);
                } else {
                    response.head.composeError("-1000","Configuration not found");
                }
            }
            response.body = Object.fromEntries(body);
            return response;
        },
        ollamacheck(ctx: any){            
            let ollama_url = Configure.getConfig("API_OLLAMA_HOST");            
            return fetch(ollama_url, {
                method: 'GET'
            })
            .then(async function(response){
                return response.text();
            })
            .catch(async function(err){
                console.log(`Error: ${err.message}`);
            });
        },
        session(ctx: any) {
            let sid = ctx.meta?.session?.id ?? uuid();            
            return {id: sid};
        },
        version(ctx: any) {
            ctx.meta.$responseRaw = true; 
            ctx.meta.$responseType = "application/json";    
            return { name: packageconfig.name, version: packageconfig.version, description: packageconfig.description };
        },
        async info(ctx: any) {
            let sid = ctx.meta?.session?.id ?? uuid();
            const result = await ctx.call("fetch.version");
            ctx.meta.$responseRaw = true; 
            ctx.meta.$responseType = "application/json";    
            return { sid: sid, hostname: os.hostname(), ...result };
        },
    },
};
export = FetchService;
