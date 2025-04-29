import { KnSetting } from "@willsofts/will-db";
import { TknOperateHandler } from '@willsofts/will-serv';
import { RAG_API_KEY, RAG_API_URL, RAG_API_URL_UPLOAD } from "../utils/EnvironmentVariable";
import { RagInfo } from "../models/QuestionAlias";
import FormData from 'form-data';
import axios from 'axios';

const crypto = require('crypto');

export class ForumOperate extends TknOperateHandler {
    
    public toHashString(texts: string) : string {
        if(texts && texts.trim().length>0) {
            return crypto.createHash('md5').update(texts).digest('hex');
        }
        return texts;
    }

    protected async updateRagDocument(form: FormData, rag: RagInfo) : Promise<RagInfo> {
        rag.ragactive = "0";
        try {
            let url = RAG_API_URL + RAG_API_URL_UPLOAD;
            const response = await axios.post(url, form, {
                headers: {
                    'x-api-key': RAG_API_KEY,
                    ...form.getHeaders(),
                },
            });    
            this.logger.debug(this.constructor.name+'.updateRagDocument: success:', response.data);
            rag.ragnote = JSON.stringify(response.data);
            if(response.data?.head?.status?.code=="200") {
                rag.ragactive = "1";
            }
        } catch(ex: any) {
            rag.ragnote = ex.message;
            this.logger.error(this.constructor.name+".updateRagDocument: error:",ex);
        }
        return rag;
    }

}
