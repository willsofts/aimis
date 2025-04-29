import { KnModel } from "@willsofts/will-db";
import { KnContextInfo } from "@willsofts/will-core";
import { ChatDOCHandler } from "./ChatDOCHandler";
import { QuestInfo, InquiryInfo, ForumConfig } from "../models/QuestionAlias";
import { ChatRepository } from "./ChatRepository";
import { ollamaChat, LlamaSession } from "../ollama/generateOllama";
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";

export class ChatNoteHandler extends ChatDOCHandler {
    public section = PRIVATE_SECTION;
    public progid = "chatnote";
    public model : KnModel = { 
        name: "tchatnote", 
        alias: { privateAlias: this.section }, 
    };

    public override async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        console.log(this.constructor.name+":[PROCESS QUEST]",quest);
        switch (quest.agent?.toLocaleUpperCase()) {                       
            case "GEMMA" :
            case "LLAMA" : {
                return await this.processQuestOllama(context, quest, model);
            }
            case "GEMINI" :
            default : { //otherwise GEMINI
                return await this.processQuestGemini(context, quest, model);
            }
        }
    }

    public override async processQuestGemini(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        quest.mime = quest.mime || "NOTE";
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processQuestGeminiAsync(context, quest, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestGeminiAsync(context, quest, model);
    }

    public async processQuestGeminiAsync(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        quest.mime = quest.mime || "NOTE";
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "NOTEFILE";
        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: quest:",quest);
        const aimodel = this.getAIModel(context);
        let db = this.getPrivateConnector(model);
        let input = quest.question;
        let forum : ForumConfig | undefined = undefined;
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            forum = await this.getForumConfig(db,category,context,true);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let table_info = forum?.tableinfo;
            let chat = chatmap.get(category);
            if(chat && chat instanceof LlamaSession) chat = undefined;            
            /*            
            if(!forum?.prompt || forum.prompt.trim().length == 0) {
                info.error = true;
                info.statuscode = "NO-DOCUMENT";
                info.answer = "No document info found.";
                return Promise.resolve(info);
            }
            */            
            if(!chat) {
                let history = this.getChatHistory(forum?.prompt || "", table_info);
                chat = aimodel.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });
                chatmap.set(category,chat);
                try { await this.logging(context,quest,history,true); } catch(ex) { this.logger.error(ex); }
            }
            let rag = await this.getRagContentInfo(quest,forum,forum);
            let msg = new Array<string>();
            if(rag && rag.contents) {
                msg.push("RAG Info: \n"+rag.contents+"\n");
            }
            msg.push("Question: "+quest.question);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: quest:",msg);
            this.logging(context,quest,msg);
            let result = await chat.sendMessage(msg);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: response:",text);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: usage:",result.response.usageMetadata);
            this.saveUsage(context,quest,result.response.usageMetadata);
            this.logging(context,quest,[text]);
            info.answer = this.parseAnswer(text);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
		} finally {
			if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public override async processQuestOllama(context: KnContextInfo, quest: QuestInfo, model: KnModel): Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        quest.mime = quest.mime || "NOTE";
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processQuestOllamaAsync(context, quest, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestOllamaAsync(context, quest, model);    
    }

    public async processQuestOllamaAsync(context: KnContextInfo, quest: QuestInfo, model: KnModel): Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        quest.mime = quest.mime || "NOTE";
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "NOTEFILE";
        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: quest:",quest);        
        let db = this.getPrivateConnector(model);
        let input = quest.question;
        let forum : ForumConfig | undefined = undefined;
        try {            
            const chatmap = ChatRepository.getInstance(info.correlation);
            forum = await this.getForumConfig(db,category,context,true);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let table_info = forum?.tableinfo;
            let chat = chatmap.get(category);
            if(chat && !(chat instanceof LlamaSession)) chat = undefined;
            if(!chat) {
                chat = new LlamaSession();
                chatmap.set(category,chat);
            } 
            /*           
            if(!forum?.prompt || forum.prompt.trim().length == 0) {
                info.error = true;
                info.statuscode = "NO-DOCUMENT";
                info.answer = "No document info found.";
                return Promise.resolve(info);
            }  
            */          
            let history = this.getChatHistoryOllama(forum?.prompt || "", table_info);
            let msg = "";
            let rag = await this.getRagContentInfo(quest,forum,forum);
            if(rag && rag.contents) {
                msg += "RAG Info: \n"+rag.contents+"\n";
            }
            msg += "Question: "+quest.question;
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: quest:",msg);
            let llama_chat = chat as LlamaSession;
            this.logging(context,quest,llama_chat.history.length==0 ? [history,msg] : [msg]);
            // ollama normal
            let response = await ollamaChat(history, msg, quest.model!, llama_chat);
            // ollama use file model
            //let response = await ollamaChat(JSON.stringify(history), msg, forum.caption!);            
            let text = response.message.content;
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:",text);
            this.logging(context,quest,[text]);
            info.answer = this.parseAnswer(text);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
		} finally {
			if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }
    
}
