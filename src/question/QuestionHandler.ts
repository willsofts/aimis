import { v4 as uuid } from 'uuid';
import { KnModel } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, VerifyError } from "@willsofts/will-core";
import { KnRecordSet } from "@willsofts/will-sql";
import { InquiryHandler } from "./InquiryHandler";
import { API_ANSWER, API_ANSWER_RECORD_NOT_FOUND, API_MODEL_CLAUDE, PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { PromptUtility } from "./PromptUtility";
import { QuestInfo, InquiryInfo, ForumConfig } from "../models/QuestionAlias";
import { claudeProcess } from "../claude/generateClaudeSystem";
import { PromptOLlamaUtility } from "./PromptOLlamaUtility";
import { ollamaGenerate } from "../ollama/generateOllama";
import { GenerativeHandler } from "./GenerativeHandler";

export class QuestionHandler extends GenerativeHandler {
    public section = PRIVATE_SECTION;
    public progid = "question";
    public model : KnModel = { 
        name: "tquestion", 
        alias: { privateAlias: this.section }, 
    };

    public handlers = [ {name: "quest"}, {name: "ask"}, {name: "history"}, {name: "view"}, {name: "reset"}];

    public async history(context: KnContextInfo) : Promise<InquiryInfo> {
        return this.callFunctional(context, {operate: "history", raw: false}, this.doHistory);
    }

    public async reset(context: KnContextInfo) : Promise<InquiryInfo> {
        return this.callFunctional(context, {operate: "reset", raw: true}, this.doReset);
    }

    public async performQuest(context: KnContextInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let questionid = context.params.questionid || "";
        return this.processQuest(context, {async: context.params.async, questionid: questionid, question: context.params.query, category: context.params.category || "AIDB", mime: context.params.mime, image: context.params.image, agent: context.params.agent, model: context.params.model || "", correlation: correlationid, classify: context.params.classify, property: context.params.property}, model);
    }

    public async doQuest(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        await this.validateInputFields(context, model, "query", "category");
        return this.performQuest(context, model);
    }

    public async doAsk(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        await this.validateInputFields(context, model, "query");
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let questionid = context.params.questionid || "";
        return this.processAsk(context, {async: context.params.async, questionid: questionid, question: context.params.query, category: context.params.category || "AIDB", mime: context.params.mime, image: context.params.image, agent: context.params.agent, model: context.params.model || "", correlation: correlationid, classify: context.params.classify, property: context.params.property});
    }

    public async doReset(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        await this.validateInputFields(context, model, "category");
        let correlationid = context.params.correlation || this.createCorrelation(context);
        return this.processReset(context.params.category,correlationid);
    }

    public async doInquiry(sql: string, quest: QuestInfo, section: string = this.section) : Promise<KnRecordSet> {
        try {
            let handler = new InquiryHandler();
            return await handler.processInquire(sql, quest, section);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        }
    }

    public async doEnquiry(sql: string, category: string, quest: QuestInfo, forum: ForumConfig) : Promise<KnRecordSet> {
        if(forum.type=="DB") {
            return this.processEnquiry(sql, category, quest, forum);
        }
        return this.processAPI(sql, category, quest, forum);
    }

    public async processEnquiry(sql: string, category: string, quest: QuestInfo, forum: ForumConfig) : Promise<KnRecordSet> {
        let db = this.getConnector(forum);
        try {
            let handler = new InquiryHandler();
            return await handler.processEnquiry(sql, quest, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let forum = await this.getForumConfiguration(context,quest,model);
        if(!forum) return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        if(quest.agent=="GEMINI") {
            return await this.processQuestGemini(context, quest, forum, model);
        } else if(quest.agent=="LLAMA") {
            return await this.processQuestOllama(context, quest, forum, model);
        } else if(quest.agent=="CLAUDE") {
            return await this.processQuestClaude(context, quest, forum, model);
        }
        return await this.processQuestGemini(context, quest, forum, model);        
    }

    public async processQuestGemini(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
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
        try {
            let table_info = forum.tableinfo;
            this.logger.debug(this.constructor.name+".processQuestGemini: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestGemini: correlation:",info.correlation,", category:",category+", input:",input);
            let version = await this.getDatabaseVersioning(forum);
            //create question prompt with table info
            let prmutil = new PromptUtility();
            let prompt = prmutil.createQueryPrompt(input, table_info, version);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestGemini: response:",text);
            this.saveUsage(context,quest,result.response.usageMetadata);
            //try to extract SQL from the response
            let sql = this.parseAnswer(text,false);
            this.logger.debug(this.constructor.name+".processQuestGemini: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs = await this.doEnquiry(sql, category, quest, forum);
            this.logger.debug(this.constructor.name+".processQuestGemini: rs:",rs);
            if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                info.answer = "Record not found.";
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestGemini: SQLResult:",datarows);
                //create reply prompt from sql and result set
                prompt = prmutil.createAnswerPrompt(input, datarows, forum.prompt);
                result = await aimodel.generateContent(prompt);
                response = result.response;
                text = response.text();
                this.logger.debug(this.constructor.name+".processQuestGemini: response:",text);
                this.saveUsage(context,quest,result.response.usageMetadata);
                info.answer = this.parseAnswer(text);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestGemini: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public async processQuestClaude(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
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
            this.logger.debug(this.constructor.name+".processQuestClaude: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestClaude: correlation:",info.correlation,", category:",category+", input:",input);
            let version = await this.getDatabaseVersioning(forum);
            //create question prompt with table info
            let prmutil = new PromptUtility();
            let system_prompt = prmutil.createClaudeQueryPrompt(table_info, version);
            let model = context?.params?.model;
            if(!model || model.trim().length==0) model = API_MODEL_CLAUDE;
            let result = await claudeProcess(system_prompt, input, model);
            this.logger.debug(this.constructor.name+".processQuestClaude: response:",result);
            //try to extract SQL from the response
            let sql = this.parseAnswer(result,false);
            this.logger.debug(this.constructor.name+".processQuestClaude: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs = await this.doEnquiry(sql, category, quest, forum);
            this.logger.debug(this.constructor.name+".processQuestClaude: rs:",rs);
            if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                info.answer = "Record not found.";
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestClaude: SQLResult:",datarows);
                //create reply prompt from sql and result set
                system_prompt = prmutil.createAnswerPrompt(input, datarows, forum.prompt);
                let result = await claudeProcess(system_prompt, input, model);
                this.logger.debug(this.constructor.name+".processQuestClaude: response:",result);
                info.answer = this.parseAnswer(result);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestClaude: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public async processQuestOllama(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig, model: KnModel = this.model) : Promise<InquiryInfo> {
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
        try {
            let table_info = forum.tableinfo;
            this.logger.debug(this.constructor.name+".processQuestOllama: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestOllama: correlation:",info.correlation,", category:",category+", input:",input);
            let version = await this.getDatabaseVersioning(forum);
            //create question prompt with table info
            let prmutil = new PromptUtility();
            let prompt = prmutil.createQueryPrompt(input, table_info, version);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestOllama: response:",text);
            this.saveUsage(context,quest,result.response.usageMetadata);
            //try to extract SQL from the response
            let sql = this.parseAnswer(text,false);
            this.logger.debug(this.constructor.name+".processQuestOllama: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs = await this.doEnquiry(sql, category, quest, forum);
            this.logger.debug(this.constructor.name+".processQuestOllama: rs:",rs);
            if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                info.answer = "Record not found.";
                this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
                return Promise.resolve(info);
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestOllama: SQLResult:",datarows);
                //create reply prompt from sql and result set
                prompt = prmutil.createAnswerPrompt(input, datarows, forum.prompt);
                result = await aimodel.generateContent(prompt);
                response = result.response;
                text = response.text();
                this.logger.debug(this.constructor.name+".processQuestOllama: response:",text);
                this.saveUsage(context,quest,result.response.usageMetadata);
                info.answer = this.parseAnswer(text);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestOllama: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public async processQuestGemma(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        return { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
    }

    public async processQuestion(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        if(quest.agent=="GEMINI") {
            return await this.processQuestionGemini(context, quest, model);        
        }
        return await this.processQuestionGemini(context, quest, model);            
    }

    public async processQuestionGemini(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        //old fashion by file system handler
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "AIDB";
        try {
            const aimodel = this.getAIModel(context);
            let input = quest.question;
            let table_info = this.getDatabaseTableInfo(category);
            this.logger.debug(this.constructor.name+".processQuestionGemini: correlation:",info.correlation,", category:",category+", input:",input);
            let version = "";
            //create question prompt with table info
            let prmutil = new PromptUtility();
            let prompt = prmutil.createQueryPrompt(input, table_info, version);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestionGemini: response:",text);
            this.saveUsage(context,quest,result.response.usageMetadata);
            //try to extract SQL from the response
            let sql = this.parseAnswer(text,false);
            this.logger.debug(this.constructor.name+".processQuestionGemini: sql:",sql);
            if(!this.isValidQuery(sql,info)) {
                return Promise.resolve(info);
            }
            info.query = sql;
            //then run the SQL query
            let rs = await this.doInquiry(sql, quest, category);
            this.logger.debug(this.constructor.name+".processQuestionGemini: rs:",rs);
            if(rs.records == 0 && API_ANSWER_RECORD_NOT_FOUND) {
                info.answer = "Record not found.";
                return Promise.resolve(info);
            }
            info.dataset = rs.rows;
            if(API_ANSWER) {
                let datarows = JSON.stringify(rs.rows);
                this.logger.debug(this.constructor.name+".processQuestionGemini: SQLResult:",datarows);
                //create reply prompt from sql and result set
                prompt = prmutil.createAnswerPrompt(input, datarows);
                result = await aimodel.generateContent(prompt);
                response = result.response;
                text = response.text();
                this.logger.debug(this.constructor.name+".processQuestionGemini: response:",text);
                this.saveUsage(context,quest,result.response.usageMetadata);
                info.answer = this.parseAnswer(text);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestionGemini: return:",JSON.stringify(info));
        return info;
    }

    public async processAsk(context: KnContextInfo, quest: QuestInfo | string) : Promise<InquiryInfo> {        
        console.log(this.constructor.name+".processAsk: quest",quest);
        let agent = typeof quest == "string" ? "GEMINI" : quest.agent?.toUpperCase();
        switch (agent) {            
            case "GEMMA" :
            case "LLAMA" : {
                return await this.processAskOllama(context, quest);
            }
            case "GEMINI" : 
            default : { 
                return await this.processAskGemini(context, quest);
            }
        }   
    }

    public async processAskGemini(context: KnContextInfo, quest: QuestInfo | string) : Promise<InquiryInfo> {
        if(typeof quest == "string") quest = { async: "", questionid: "", question: quest, category: "AIDB", mime: "", image: "", agent: "", model:"", correlation: uuid(), classify: "", property: context?.params?.property};
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        try {
            const aimodel = this.getAIModel(context);
            let input = quest.question;
            let prmutil = new PromptUtility();
            let prompt = prmutil.createAskPrompt(input);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processAskGemini: response:",text);
            this.saveUsage(context,quest,result.response.usageMetadata);
            info.answer = this.parseAnswer(text);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processAskGemini: return:",JSON.stringify(info));
        return info;
    }

    public async processAskOllama(context: KnContextInfo, quest: QuestInfo | string) : Promise<InquiryInfo> {
        if(typeof quest == "string") quest = { async: "", questionid: "", question: quest, category: "AIDB", mime: "", image: "", agent: "", model:"", correlation: uuid(), classify: "", property: context?.params?.property};
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        try {
            let input = quest.question;            
            let prmutil = new PromptOLlamaUtility();
            let prompt = prmutil.createAskPrompt(input);
            let result = await ollamaGenerate(prompt, quest.model!);
            this.logger.debug(this.constructor.name+".processAskOllama: result",result);
            let response = result.response;
            this.logger.debug(this.constructor.name+".processAskOllama: response:", response);
            this.saveUsage(context,quest,result);
            info.answer = this.parseAnswer(response);            
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processAskOllama: return:",JSON.stringify(info));
        return info;
    }

    public async processReset(category: string, correlation: string) : Promise<InquiryInfo> {
        return Promise.resolve({ questionid: "", correlation: correlation, category: category, classify: "", error: false, statuscode: "", question: "reset", query: category, answer: "OK", dataset: [] });
    }

    public async getHistory(category: string, correlation: string) : Promise<any[]>{
        return Promise.resolve([]);
    }

    public async doHistory(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateInputFields(context, model, "query");
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let query = context.params.query;
        if(query && query.trim().length>0) {
            return this.getHistory(context.params.query,correlationid);
        }
        return [];
    }
    
}
