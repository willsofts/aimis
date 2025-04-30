import { KnModel, KnOperation } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, KnDataTable, VerifyError } from "@willsofts/will-core";
import { KnDBError, KnRecordSet } from "@willsofts/will-sql";
import { ChatSession } from "@google/generative-ai";
import { API_ANSWER, API_ANSWER_RECORD_NOT_FOUND, API_MODEL_CLAUDE, PRIVATE_SECTION, API_MODEL_LLAMA } from "../utils/EnvironmentVariable";
import { PromptUtility } from "./PromptUtility";
import { QuestionHandler } from "./QuestionHandler";
import { QuestInfo, InquiryInfo, ForumConfig } from "../models/QuestionAlias";
import { ChatRepository } from "./ChatRepository";
import { claudeProcess } from "../claude/generateClaudeSystem";
import { PromptOLlamaUtility } from "./PromptOLlamaUtility";
import { ollamaChat, ollamaGenerate, LlamaSession } from "../ollama/generateOllama";

export class ChatHandler extends QuestionHandler {
    public section = PRIVATE_SECTION;
    public progid = "chat";
    public model : KnModel = { 
        name: "tchat", 
        alias: { privateAlias: this.section }, 
    };

    public getChatHistory(category: string, table_info: string, version: string) {
        let prmutil = new PromptUtility();
        let prompt = prmutil.createChatPrompt("", table_info, version);
        return [
            {
                role: "user",
                parts: [{text: prompt}],
            },
            {
                role: "model",
                parts: [{text: "Great to meet you. What would you like to know?"}],
            },
        ];
    }

    public getChatHistoryOllama(category: string, table_info: string, version: string) : string {
        let prmutil = new PromptOLlamaUtility();
        return prmutil.createChatPrompt(category, "", table_info, version);
    }

    public getChatHistoryGemma(category: string, table_info: string, version: string) : string {
        let prmutil = new PromptOLlamaUtility();
        return prmutil.createChatPrompt_ori("", table_info, version);
    }

    public override async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        this.logger.debug(this.constructor.name+":[PROCESS QUEST]",quest);
        let forum = await this.getForumConfiguration(context,quest,model);
        if(!forum) return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        let agent = quest.agent || forum?.agent;
        switch (agent?.toLocaleUpperCase()) {            
            case "CLAUDE": {
                return await this.processQuestClaude(context, quest, forum, model);
            }
            case "GEMMA" :
            case "LLAMA" : {
                return await this.processQuestOllama(context, quest, forum, model);
            }
            case "GEMINI" :
            default : { //otherwise GEMINI
                return await this.processQuestGemini(context, quest, forum, model);
            }
        }
    }

    public override async processQuestGemini(context: KnContextInfo, quest: QuestInfo, forum: ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processQuestGeminiAsync(context, quest, forum).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestGeminiAsync(context, quest, forum);
    }
    public async processQuestGeminiAsync(context: KnContextInfo, quest: QuestInfo, forum: ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "AIDB";
        const aimodel = this.getAIModel(context);
        let input = quest.question;
        //let db = this.getPrivateConnector(model);
        //let forum : ForumConfig | undefined = undefined;
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            //forum = await this.getForumConfig(db,category,context);
            //if(!forum) return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let table_info = forum.tableinfo;
            let chat = chatmap.get(category);
            if(chat && chat instanceof LlamaSession) chat = undefined;
            if(!chat) {
                let version = await this.getDatabaseVersioning(forum);
                let history = this.getChatHistory(category, table_info, version);
                chat = aimodel.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });
                chatmap.set(category,chat);
                try { await this.logging(context,quest,history,true); } catch(ex) { this.logger.error(ex); }
            }
            let msg = ["Question: "+input];
            if(quest.property) {
                let moreinfo = PromptUtility.getMoreInfo(quest.property);
                if(moreinfo && moreinfo.trim().length>0) {
                    msg.push(moreinfo+" \n\n");
                }
            }
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: question:",msg);
            this.logging(context,quest,msg);
            let result = await chat.sendMessage(msg);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: response:",text);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: usage:",result.response.usageMetadata);
            this.saveUsage(context,quest,result.response.usageMetadata);
            this.logging(context,quest,[text]);
            //try to extract SQL from the response
            let sql = this.parseAnswer(text,true);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs : KnRecordSet = { records: 0, rows: [], columns: [] };
            try {
                rs = await this.doEnquiry(sql, category, quest, forum);
                this.logger.debug(this.constructor.name+".processQuestGeminiAsync: rs:",rs);
                if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                    info.answer = "Record not found.";
                    this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                    return Promise.resolve(info);
                }
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                if(ex instanceof KnDBError) {
                    //try again
                    let msg = "Error: "+ex.message;
                    let result = await chat.sendMessage(msg);
                    let response = result.response;
                    let text = response.text();
                    this.logger.debug(this.constructor.name+".processQuestGeminiAsync: catch response:",text);
                    this.logging(context,quest,[text]);
                    let sql = this.parseAnswer(text,true);
                    this.logger.debug(this.constructor.name+".processQuestGeminiAsync: catch sql:",sql);
                    if(!sql || sql.trim().length==0) {
                        info.error = true;
                        info.answer = this.getDBError(ex).message;
                        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                        return Promise.resolve(info);    
                    }
                    if(!this.isValidQuery(sql,info)) {
                        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                        return Promise.resolve(info);
                    }
                    info.query = sql;
                    try {
                        rs = await this.doEnquiry(sql, category, quest, forum);
                        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: catch rs:",rs);
                        if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                            info.answer = "Record not found.";
                            this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                            return Promise.resolve(info);
                        }
                    } catch(exc: any) {
                        this.logger.error(this.constructor.name,exc);
                        info.error = true;
                        info.statuscode = "ERROR";
                        info.answer = this.getDBError(exc).message;
                        this.sendError(chat,info.answer);
                        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                        return Promise.resolve(info);                    
                    }
                } else {
                    info.error = true;
                    info.statuscode = "ERROR";
                    info.answer = this.getDBError(ex).message;
                    this.sendError(chat,info.answer);
                    this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                    return Promise.resolve(info);
                }
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestGeminiAsync: SQLResult:",datarows);
                //create reply prompt from sql and result set
                let prmutil = new PromptUtility();
                let prompt = prmutil.createAnswerPrompt(input, datarows, forum.prompt);
                this.saveTokenUsage(context,quest,prompt,aimodel);
                this.logging(context,quest,[prompt]);
                result = await aimodel.generateContent(prompt);
                response = result.response;
                text = response.text();
                this.logger.debug(this.constructor.name+".processQuestGeminiAsync: response:",text);
                this.logging(context,quest,[text]);
                info.answer = this.parseAnswer(text);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
		} finally {
			//if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public override async processQuestClaude(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processQuestClaudeAsync(context, quest, forum, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestClaudeAsync(context, quest, forum, model);
    }

    public async processQuestClaudeAsync(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "AIDB";
        let input = quest.question;
        try {
            let table_info = forum.tableinfo;
            this.logger.debug(this.constructor.name+".processQuestClaudeAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestClaudeAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let version = await this.getDatabaseVersioning(forum);
            //create question prompt with table info
            let prmutil = new PromptUtility();
            let system_prompt = prmutil.createClaudeQueryPrompt(table_info, version);
            let model = context?.params?.model;
            if(!model || model.trim().length==0) model = API_MODEL_CLAUDE;
            let msg = input;
            if(quest.property && quest.property.trim().length>0) {
                msg = PromptUtility.getMoreInfo(quest.property)+" \n\n"+msg;
            }
            this.logging(context,quest,[system_prompt,msg]);
            let result = await claudeProcess(system_prompt, msg, model);
            this.logger.debug(this.constructor.name+".processQuestClaudeAsync: response:",result);
            this.logging(context,quest,[result]);
            //try to extract SQL from the response
            let sql = this.parseAnswer(result,false);
            this.logger.debug(this.constructor.name+".processQuestClaudeAsync: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs = await this.doEnquiry(sql, category, quest, forum);
            this.logger.debug(this.constructor.name+".processQuestClaudeAsync: rs:",rs);
            if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                info.answer = "Record not found.";
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestClaudeAsync: SQLResult:",datarows);
                //create reply prompt from sql and result set
                system_prompt = prmutil.createAnswerPrompt(input, datarows, forum.prompt);
                this.logging(context,quest,[system_prompt,input]);
                let result = await claudeProcess(system_prompt, input, model);
                this.logger.debug(this.constructor.name+".processQuestClaudeAsync: response:",result);
                this.logging(context,quest,[result]);
                info.answer = this.parseAnswer(result);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestClaudeAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public override async processQuestOllama(context: KnContextInfo, quest: QuestInfo, forum: ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processQuestOllamaAsync(context, quest, forum, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestOllamaAsync(context, quest, forum, model);
    }

    public async processQuestOllamaAsync(context: KnContextInfo, quest: QuestInfo, forum: ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "AIDB";        
        let input = quest.question;
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let table_info = forum.tableinfo;            
            let chat = chatmap.get(category);
            if(chat && !(chat instanceof LlamaSession)) chat = undefined;
            if(!chat) {
                chat = new LlamaSession();
                chatmap.set(category,chat);
            }
            let version = await this.getDatabaseVersioning(forum);
            let history = this.getChatHistoryOllama(category, table_info, version);
            if (quest.agent?.toLocaleUpperCase() == "GEMMA"){
                history = this.getChatHistoryGemma(category, table_info, version);              
            }
            console.log(history);
            //let msg = "Question: "+input;
            let msg = input;
            if(quest.property && quest.property.trim().length>0) {
                msg = PromptUtility.getMoreInfo(quest.property)+" \n\n"+msg;
            }
            this.logging(context,quest,[history,msg]);
            let response = await ollamaChat(history, msg, quest.model || API_MODEL_LLAMA, chat as LlamaSession);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:",response);
            let text = response?.message?.content;
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:",text);
            this.logging(context,quest,[text]);
            //(chat as LlamaSession).add(contents);
            //try to extract SQL from the response
            let sql = this.parseAnswer(text,true);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs : KnRecordSet = { records: 0, rows: [], columns: [] };
            try {
                rs = await this.doEnquiry(sql, category, quest, forum);
                this.logger.debug(this.constructor.name+".processQuestOllamaAsync: rs:",rs);
                if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                    info.answer = "Record not found.";
                    this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                    return Promise.resolve(info);
                }
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                info.error = true;
                info.statuscode = "ERROR";
                info.answer = this.getDBError(ex).message;
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {                
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestOllamaAsync: SQLResult:",datarows);
                //create reply prompt from sql and result set
                let prmutil = new PromptOLlamaUtility();
                let prompt = prmutil.createAnswerPrompt(input, datarows, forum.prompt);
                this.logging(context,quest,[prompt]);
                let result = await ollamaGenerate(prompt, quest.model || API_MODEL_LLAMA);
                let response = result.response; 
                this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:", response);
                this.logging(context,quest,[response]);
                info.answer = this.parseAnswer(response);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public sendError(chat: ChatSession, errmsg: string) {
        let msg = "Error: "+errmsg;
        chat.sendMessage(msg).then((msg: any) => { 
            this.logger.info(this.constructor.name+".sendError",msg); 
        }).catch((ex: any) => { 
            this.logger.error(this.constructor.name+".sendError",ex); 
        });
    }

    public override async getHistory(category: string, correlation: string, map?:  Map<string,ChatSession>) : Promise<any[]>{
        this.logger.debug(this.constructor.name+".getHistory: category",category,", correlation",correlation);
        let chat = map?map.get(category):ChatRepository.getInstance(correlation).get(category); 
        if(chat) {
            return chat.getHistory();
        }
        return Promise.resolve([]);
    }

    public async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let history : any = [];
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let query = context.params.query;
        if(query && query.trim().length>0) {
            try {
                history = await this.getHistory(query,correlationid);
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
            }
        }
        let title = context.params.title || "";
        return this.createDataTable(KnOperation.VIEW, {title: title, history: history}, {}, "question/history");        
    }    

    public override async processReset(category: string, correlation: string) : Promise<InquiryInfo> {
        this.logger.debug(this.constructor.name+".processReset: category:",category,", correlation:",correlation);
        const chatmap = ChatRepository.getInstance(correlation);
        let chat = chatmap.get(category);
        if(!chat) {
            return Promise.resolve({ questionid: "", correlation: correlation, category: category, error: false, statuscode: "", question: category, query: "reset", answer: "Not found", dataset: [] });
        }
        chatmap.remove(category);
        this.logger.debug(this.constructor.name+".processReset: remove category:",category,", correlation:",correlation);
        return Promise.resolve({ questionid: "", correlation: correlation, category: category, error: false, statuscode: "", question: category, query: "reset", answer: "Reset OK", dataset: [] });
    }

}
