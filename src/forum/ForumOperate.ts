import { TknOperateHandler } from '@willsofts/will-serv';
import { KnDataSet } from "@willsofts/will-core";
import { RAG_API_KEY, RAG_API_URL, RAG_API_URL_UPLOAD, RAG_API_URL_UPLOAD_ASYNC, RAG_API_URL_UPLOAD_ASYNC_WEBHOOK } from "../utils/EnvironmentVariable";
import { RagInfo, AgentModelInfo } from "../models/QuestionAlias";
import FormData from 'form-data';
import axios from 'axios';
import agent_models from "../../config/model.json";

const crypto = require('crypto');

export class ForumOperate extends TknOperateHandler {
    
    public toHashString(texts: string) : string {
        if(texts && texts.trim().length>0) {
            return crypto.createHash('md5').update(texts).digest('hex');
        }
        return texts;
    }

    protected async updateRagDocument(form: FormData, rag: RagInfo) : Promise<RagInfo> {
        if(rag.ragasync) {
            return this.updateRagDocumentAsync(form,rag);
        }
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

    protected async updateRagDocumentAsync(form: FormData, rag: RagInfo) : Promise<RagInfo> {
        rag.ragactive = "0";
        try {
            //this is async call in order to prevent error time out of long time process
            //this must define webhook url in order to accept response
            form.append("webhook_url",RAG_API_URL_UPLOAD_ASYNC_WEBHOOK);
            let url = RAG_API_URL + RAG_API_URL_UPLOAD_ASYNC;
            const response = await axios.post(url, form, {
                headers: {
                    'x-api-key': RAG_API_KEY,
                    ...form.getHeaders(),
                },
            });    
            this.logger.debug(this.constructor.name+'.updateRagDocumentAsync: success:', response.data);
            rag.ragnote = JSON.stringify(response.data);
        } catch(ex: any) {
            rag.ragnote = ex.message;
            this.logger.error(this.constructor.name+".updateRagDocumentAsync: error:",ex);
        }
        return rag;
    }

    protected async getAgentModels() : Promise<KnDataSet> {
        let result : KnDataSet = {};
        agent_models.forEach((item:any) => { result[item.model] = item.name; });
        return result;
    }

    protected async getModelItem(model: string) : Promise<AgentModelInfo | undefined> {
        return agent_models.find((item:any) => item.model == model);
    }

}
