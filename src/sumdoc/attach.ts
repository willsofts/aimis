import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, } from "@willsofts/will-core";
import { TknAttachHandler } from "@willsofts/will-core";
import { SumDocHandler } from "./SumDocHandler";
import { Request, Response } from 'express';
import path from "path";

class AttachSumDocHandler extends SumDocHandler {

    public async exports(context: KnContextInfo, req: Request, res: Response) : Promise<void> {
        this.logger.debug(this.constructor.name+".exports: params",context.params);
        let handler = new TknAttachHandler();
        handler.obtain(this.broker,this.logger);
        try {
            let rs = await handler.getAttachInfo(context.params.attachid,context,this.model);
            if(rs && rs.rows?.length > 0) {
                let row = rs.rows[0];
                if(row.attachstream) {
                    let attachfile = path.basename(row.attachpath);
                    let filename = row.sourcefile || attachfile;
                    res.attachment(filename);
                    res.send(Buffer.from(row.attachstream,"base64"));
                    return;
                }
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            res.status(HTTP.INTERNAL_SERVER_ERROR).send(this.getDBError(ex).message);
            return;
        }
        res.status(HTTP.NOT_FOUND).send("Not found");
    }

}

export = new AttachSumDocHandler();
