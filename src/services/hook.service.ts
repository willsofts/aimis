import { ServiceSchema } from "moleculer";

const HookService : ServiceSchema = {
    name: "hook",
    actions: {
        scratch(ctx: any) {
            ctx.meta.$responseRaw = true;
            return ctx.params;
        },
    },
};
export = HookService;
