module.exports = {
    name: "MiddlewareTracing",
    localAction(next,action) {
        return async function(ctx) {
            if (ctx?.span?.tags) {
                if(!ctx.span.tags?.sessionID && ctx.params.req?.session) {
                    ctx.span.tags.sessionID = ctx.params.req.session?.id;
                }
                if(!ctx.span.tags?.authToken && ctx.params.req?.headers) {
                    ctx.span.tags.authToken = ctx.params.req.headers.authtoken || ctx.params.req.headers.tokenkey;
                }
                if(!ctx.span.tags?.authToken) {
                    ctx.span.tags.authToken = ctx.params.authtoken || ctx.params.tokenkey;
                }
                if(!ctx.span.tags?.authToken && ctx.params.req?.params) {
                    ctx.span.tags.authToken = ctx.params.req.params.authtoken || ctx.params.req.params.tokenkey;
                }
                if(!ctx.span.tags?.authToken && ctx.params.req?.body) {
                    ctx.span.tags.authToken = ctx.params.req.body.authtoken || ctx.params.req.body.tokenkey;
                }
                if(!ctx.span.tags?.authToken && ctx.params.req?.query) {
                    ctx.span.tags.authToken = ctx.params.req.query.authtoken || ctx.params.req.query.tokenkey;
                }
            }
            return next(ctx);
        }
    }
};
