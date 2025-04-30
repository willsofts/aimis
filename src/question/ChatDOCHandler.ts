import { KnModel } from "@willsofts/will-db";
import { KnDBConnector } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, VerifyError } from "@willsofts/will-core";
import { ChatPDFHandler } from "./ChatPDFHandler";
import { QuestInfo, InquiryInfo, ForumConfig } from "../models/QuestionAlias";
import { ChatRepository } from "./ChatRepository";
import { ForumDocHandler } from "../forumdoc/ForumDocHandler";
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";

export class ChatDOCHandler extends ChatPDFHandler {
    public section = PRIVATE_SECTION;
    public progid = "chatdoc";
    public model : KnModel = { 
        name: "tchatdoc", 
        alias: { privateAlias: this.section }, 
    };

    public override async getForumConfig(db: KnDBConnector, category: string, context?: KnContextInfo, throwNotFoundError: boolean = false) : Promise<ForumConfig | undefined> {
        let handler = new ForumDocHandler();
        let result = await handler.getForumConfig(db,category,context);
        if(!result && throwNotFoundError) {
            return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        }
        return result;
    }

    public override async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        quest.mime = quest.mime || "DOC";
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let forum = await this.getForumConfiguration(context,quest,model);
        //if(!forum) return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        if(String(quest.async)=="true") {
            this.processQuestAsync(context, quest, forum, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestAsync(context, quest, forum, model);        
    }

    public override async processQuestAsync(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig | undefined, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        quest.mime = quest.mime || "DOC";
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "DOCFILE";
        this.logger.debug(this.constructor.name+".processQuestAsync: quest:",quest);
        const aimodel = this.getAIModel(context);
        let input = quest.question;
        let db = this.getPrivateConnector(model);
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            this.logger.debug(this.constructor.name+".processQuestAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let table_info = forum?.tableinfo;
            let chat = chatmap.get(category);
            let image_info = await this.getFileImageInfo(quest.image,db);
            if(image_info == null && !chat) {    
                info.error = true;
                info.statuscode = "NO-DOCUMENT";
                info.answer = "No document info found.";
                return Promise.resolve(info);
            }
            if(image_info && image_info.file.length > 0) {
                info.answer = "";
                let data = await this.readDucumentFile(image_info);
                this.logger.debug(this.constructor.name+".processQuestAsync: data:",data);
                if(data.text.trim().length == 0) {
                    info.error = true;
                    info.statuscode = "NO-TEXT";
                    info.answer = "No text found in document file.";
                    return Promise.resolve(info);
                }
                info.dataset = data.text;
                if(chat) {
                    chatmap.remove(category);
                }   
                let history = this.getChatHistory(data.text, table_info);
                chat = aimodel.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });
                chatmap.set(category,chat);
                let msg = "Question: "+quest.question;
                let result = await chat.sendMessage(msg);
                let response = result.response;
                let text = response.text();
                this.logger.debug(this.constructor.name+".processQuestAsync: response:",text);
                this.logger.debug(this.constructor.name+".processQuestAsync: usage:",result.response.usageMetadata);
                this.saveUsage(context,quest,result.response.usageMetadata);
                info.answer = this.parseAnswer(text);
            } else {
                if(chat) {
                    let msg = "Question: "+quest.question;
                    let result = await chat.sendMessage(msg);
                    let response = result.response;
                    let text = response.text();
                    this.logger.debug(this.constructor.name+".processQuestAsync: response:",text);
                    this.logger.debug(this.constructor.name+".processQuestAsync: usage:",result.response.usageMetadata);
                    this.saveUsage(context,quest,result.response.usageMetadata);        
                    info.answer = this.parseAnswer(text);    
                } else {
                    info.error = true;
                    info.statuscode = "NO-FILE";
                    info.answer = "No document file found.";
                }
            }
            this.deleteAttach(quest.image);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
		} finally {
			if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuestAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }
    public async processQuestGemini(context: KnContextInfo, quest: QuestInfo, forum: ForumConfig | undefined, model: KnModel = this.model) : Promise<InquiryInfo> {
        return this.processQuest(context, quest, model);
    }
    public async processQuestOllama(context: KnContextInfo, quest: QuestInfo, forum: ForumConfig | undefined, model: KnModel = this.model) : Promise<InquiryInfo> {
        return this.processQuest(context, quest, model);
    }
}
