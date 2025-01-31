import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnContextInfo, KnValidateInfo, KnDataTable } from "@willsofts/will-core";
import { QuestInfo, InquiryInfo } from "../models/QuestionAlias";
import { VisionHandler } from "./VisionHandler";
import { API_KEY, API_MODEL, PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { PromptUtility } from "./PromptUtility";
import { QuestionUtility } from "./QuestionUtility";
import { ChatSession, GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ChatRepository } from "./ChatRepository";
import { PromptOLlamaUtility } from "./PromptOLlamaUtility";

const genAI = new GoogleGenerativeAI(API_KEY);

export class ChatPDFHandler extends VisionHandler {
    public section = PRIVATE_SECTION;
    public progid = "chatpdf";
    public model : KnModel = { 
        name: "tchatpdf", 
        alias: { privateAlias: this.section }, 
    };
    public handlers = [ {name: "quest"}, {name: "ask"}, {name: "view"}, {name: "reset"} ];

    public async reset(context: KnContextInfo) : Promise<InquiryInfo> {
        return this.callFunctional(context, {operate: "reset", raw: true}, this.doReset);
    }

    public async doReset(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        let correlationid = this.createCorrelation(context);
        /*
        let vi = this.validateParameters(context.params,"correlation");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }*/
        return this.processReset(context.params.category,context.params.correlation || correlationid);
    }


    public getChatHistory(document: string, prompt_info?: string) {
        let prmutil = new PromptUtility();
        let prompt = prmutil.createChatDocumentPrompt(document, prompt_info);
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
    
    public getChatHistoryOllama(document: string, prompt_info?: string) {
    
        let prmutil = new PromptOLlamaUtility();
        let prompt = prmutil.createChatDocumentPrompt(document, prompt_info);
        return prompt;
    }
    
    public override validateParameter(question: string, mime: string, image: string) : KnValidateInfo {
        if(!question || question.length == 0) {
            return {valid: false, info: "question" };
        }
        if(!mime || mime.length == 0) {
            return {valid: false, info: "mime type"};
        }
        return {valid: true};
    }

    public readDucumentFile(filePath: string) : Promise<any> {
        return QuestionUtility.readDucumentFile(filePath);
    }

    public getAIModel(context?: KnContextInfo) : GenerativeModel {
        let model = context?.params?.model;
        if(!model || model.trim().length==0) model = API_MODEL;
        this.logger.debug(this.constructor.name+".getAIModel: using model",model);
        return genAI.getGenerativeModel({ model: model,  generationConfig: { temperature: 0 }});
    }

    public override async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(quest.async=="true") {
            this.processQuestAsync(context, quest, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestAsync(context, quest, model);
    }

    public async processQuestAsync(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category || "PDFFILE";
        this.logger.debug(this.constructor.name+".processQuest: quest:",quest);
        const aimodel = this.getAIModel(context);
        let db = this.getPrivateConnector(model);
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            let chat = chatmap.get(category);
            let image_info = await this.getFileImageInfo(quest.image,db);
            if(image_info == null && !chat) {    
                info.error = true;
                info.answer = "No document info found.";
                return Promise.resolve(info);
            }
            if(image_info && image_info.file.length > 0) {
                info.answer = "";
                let data = await this.readDucumentFile(image_info.file);
                this.logger.debug(this.constructor.name+".processQuestion: data:",data);
                if(data.text.trim().length == 0) {
                    info.error = true;
                    info.answer = "No text found in document file.";
                    return Promise.resolve(info);
                }
                info.dataset = data.text;
                if(chat) {
                    chatmap.remove(category);
                }   
                let history = this.getChatHistory(data.text);
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
                this.logger.debug(this.constructor.name+".processQuest: response:",text);
                this.logger.debug(this.constructor.name+".processQuest: usage:",result.response.usageMetadata);
                this.saveUsage(context,quest,result.response.usageMetadata);    
                info.answer = this.parseAnswer(text);
            } else {
                if(chat) {
                    let msg = "Question: "+quest.question;
                    let result = await chat.sendMessage(msg);
                    let response = result.response;
                    let text = response.text();
                    this.logger.debug(this.constructor.name+".processQuest: response:",text);
                    this.logger.debug(this.constructor.name+".processQuest: usage:",result.response.usageMetadata);
                    this.saveUsage(context,quest,result.response.usageMetadata);        
                    info.answer = this.parseAnswer(text);    
                } else {
                    info.error = true;
                    info.answer = "No document file found.";
                }
            }
            this.deleteAttach(quest.image);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.answer = this.getDBError(ex).message;
		} finally {
			if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuest: return:",JSON.stringify(info));
        return info;
    }

    public async processQuestion(quest: QuestInfo, context: KnContextInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: [] };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(quest.async=="true") {
            this.processQuestionAsync(quest, context, model).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestionAsync(quest, context, model);    
    }

    public async processQuestionAsync(quest: QuestInfo, context: KnContextInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: [] };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        this.logger.debug(this.constructor.name+".processQuestion: quest:",quest);
        let db = this.getPrivateConnector(model);
        try {
            info.answer = "";
            let data = await this.readDucumentFile(quest.image); //quest.image is file path
            this.logger.debug(this.constructor.name+".processQuestion: data:",data);
            info = await this.processAsk(quest,context,data.text);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.answer = this.getDBError(ex).message;
		} finally {
			if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuestion: return:",JSON.stringify(info));
        return info;
    }

    public override async processAsk(quest: QuestInfo, context: KnContextInfo, document?: string) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: document };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(!document || document.trim().length == 0) {
            info.error = true;
            info.answer = "No document found.";
            return Promise.resolve(info);
        }
        if(quest.async=="true") {
            this.processAskAsync(quest, context, document).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processAskAsync(quest, context, document);    
    }

    public async processAskAsync(quest: QuestInfo, context: KnContextInfo, document?: string) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: document };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(!document || document.trim().length == 0) {
            info.error = true;
            info.answer = "No document found.";
            return Promise.resolve(info);
        }
        try {
            const aimodel = this.getAIModel(context);
            let input = quest.question;
            let prmutil = new PromptUtility();
            let prompt = prmutil.createDocumentPrompt(input,document);
            let result = await aimodel.generateContent(prompt);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processAsk: response:",text);
            this.saveTokenUsage(context,quest,prompt,aimodel);
            info.answer = this.parseAnswer(text);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processAsk: return:",JSON.stringify(info));
        return info;
    }

    public async getHistory(category: string, correlation: string, map?:  Map<String,ChatSession>) : Promise<any[]>{
        let chat = map?map.get(category):ChatRepository.getInstance(correlation).get(category); 
        if(chat) {
            return chat.getHistory();
        }
        return Promise.resolve([]);
    }

    public async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let history : any = [];
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let query = context.params.query || "PDFFILE";
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

    public async processReset(category: string,correlation: string) : Promise<InquiryInfo> {
        this.logger.debug(this.constructor.name+".processReset: category:",category);
        if(!category || category.trim().length == 0) category = "PDFFILE";
        const chatmap = ChatRepository.getInstance(correlation);
        let chat = chatmap.get(category);
        if(!chat) {
            return Promise.resolve({ questionid: "", correlation: correlation, category: category, error: false, question: category, query: "reset", answer: "Not found", dataset: [] });
        }
        chatmap.remove(category);
        this.logger.debug(this.constructor.name+".processReset: remove category:",category);
        return Promise.resolve({ questionid: "", correlation: correlation, category: category, error: false, question: category, query: "reset", answer: "Reset OK", dataset: [] });
    }

}
