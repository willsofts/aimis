import { ServiceSchema } from "moleculer";
const os = require("os");

const HealthCheckService : ServiceSchema = {
    name: "health",
    actions: {
        check(ctx: any) {
            ctx.meta.$responseRaw = true; 
            ctx.meta.$responseType = "application/json";    
            return {status: "OK", hostname: os.hostname(), pid: process.pid};
        },
    },
};
export = HealthCheckService;
