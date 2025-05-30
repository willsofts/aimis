import { KnModel } from "@willsofts/will-db";
import { KnDBConnector } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, VerifyError } from "@willsofts/will-core";
import { ChatPDFHandler } from "./ChatPDFHandler";
import { QuestInfo, InquiryInfo, ForumConfig, InlineImage, FileImageInfo } from "../models/QuestionAlias";
import { ChatRepository } from "./ChatRepository";
import { ForumDocHandler } from "../forumdoc/ForumDocHandler";
import { PromptUtility } from "./PromptUtility";
import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { API_KEY, API_MODEL, PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { PromptOLlamaUtility } from "./PromptOLlamaUtility";
import { ollamaGenerate, ollamaImageAsk, ollamaImageChat } from "../ollama/generateOllama";
import { ExtractDataFromImage } from "../tesseract/TesseractHandler";

const genAI = new GoogleGenerativeAI(API_KEY);

export class ChatImageHandler extends ChatPDFHandler {
    public section = PRIVATE_SECTION;
    public progid = "chatimage";
    public model : KnModel = { 
        name: "tchatimage", 
        alias: { privateAlias: this.section }, 
    };

    public getChatHistory(document?: string, prompt_info?: string) {
        let prmutil = new PromptUtility();
        let prompt = prmutil.createChatImagePrompt(document, prompt_info);
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

    public getChatHistoryOllama(document?: string, prompt_info?: string, enquiry?: string) {
        let prmutil = new PromptOLlamaUtility();
        let prompt = prmutil.createChatImagePrompt(document, prompt_info, enquiry);
        return prompt;
    }

    public getChatHistoryTesseract(document?: string, prompt_info?: string, ocr_text?: string, enquiry?: string) {
        let prmutil = new PromptOLlamaUtility();
        let prompt = prmutil.createChatImageWithTesseractPrompt(document, prompt_info, ocr_text, enquiry);
        return prompt;
    }

    public getAIModel(context?: KnContextInfo) : GenerativeModel {
        let model = context?.params?.model;
        if(!model || model.trim().length==0) model = API_MODEL;
        this.logger.debug(this.constructor.name+".getAIModel: using model",model);
        /*
        let safetySettings : SafetySetting[] = [
            { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ];*/
        return genAI.getGenerativeModel({ model: model,  generationConfig: { temperature: 0 } });
    }

    public override async getForumConfig(db: KnDBConnector, category: string,context?: KnContextInfo, throwNotFoundError: boolean = false) : Promise<ForumConfig | undefined> {
        let handler = new ForumDocHandler();
        let result = await handler.getForumConfig(db,category,context);
        if(!result && throwNotFoundError) {
            return Promise.reject(new VerifyError("Configuration not found",HTTP.NOT_FOUND,-16004));
        }
        return result;
    }

    public async getInlineImage(quest: QuestInfo, db: KnDBConnector) : Promise<InlineImage | undefined> {
        let img_info = undefined;
        let image_info = await this.getFileImageInfo(quest.image,db);
        if(image_info && image_info.file.length > 0 && image_info.stream) {
            img_info = this.getImageInfo(image_info.mime,image_info.stream);
        }
        return img_info;
    }

    public async getImageFileInfo(quest: QuestInfo, db: KnDBConnector) : Promise<FileImageInfo | null > {        
        return await this.getFileImageInfo(quest.imageocr == null ? quest.image : quest.imageocr, db);
    }

    public override async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model, img_info?: InlineImage) : Promise<InquiryInfo> {
        console.log(this.constructor.name+":[PROCESS QUEST]",quest);
        let forum = await this.getForumConfiguration(context,quest,model);
        switch (quest.agent?.toLocaleUpperCase()) {            
            case "LLAVA" : 
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

    public async processQuestGemini(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig | undefined, model: KnModel = this.model, img_info?: InlineImage) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(quest.async=="true") {
            this.processQuestGeminiAsync(context, quest, forum, model, img_info).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestGeminiAsync(context, quest, forum, model, img_info);
    }

    public async processQuestGeminiAsync(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig | undefined, model: KnModel = this.model, img_info?: InlineImage) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "DOCFILE";
        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: quest:",quest);
        let input = quest.question;
        const aimodel = this.getAIModel(context);
        let db = this.getPrivateConnector(model);
        //let forum : ForumConfig | undefined = undefined;
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let chat = chatmap.get(category);
            if(!chat) {
                let history = this.getChatHistory(forum?.prompt, forum?.tableinfo);
                chat = aimodel.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });
                chatmap.set(category,chat);
            }
            let hasParam = img_info;
            if(!hasParam) img_info = await this.getInlineImage(quest,db);
            console.log("img_info",img_info);
            let msg = "Question: "+quest.question;
            let result = await chat.sendMessage(img_info ? [msg, img_info] : msg);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: response:",text);
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: usage:",result.response.usageMetadata);
            this.saveUsage(context,quest,result.response.usageMetadata);
            info.answer = this.parseAnswer(text);    
            if(!hasParam) this.deleteAttach(quest.image);
            else chatmap.remove(category);
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

    public async processQuestOllama(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig | undefined, model: KnModel = this.model, img_info?: FileImageInfo | null) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(quest.async=="true") {
            this.processQuestOllamaAsync(context, quest, forum, model, img_info).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestOllamaAsync(context, quest, forum, model, img_info);
    }

    public async processQuestOllamaAsync(context: KnContextInfo, quest: QuestInfo, forum : ForumConfig | undefined, model: KnModel = this.model, img_info?: FileImageInfo | null) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "DOCFILE";
        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: quest:",quest);        
        let db = this.getPrivateConnector(model);
        let input = quest.question;
        try {
            const chatmap = ChatRepository.getInstance(info.correlation);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let hasParam = img_info;
            if(!hasParam) img_info = await this.getImageFileInfo(quest, db);
            if (quest.imagetmp){
                this.deleteAttach(quest.imagetmp);
            }
            let msg = "Question: "+quest.question;
            if (img_info != null) {

                let prmutil = new PromptOLlamaUtility();
                switch (quest.agent?.toLocaleUpperCase()) {      
                    case "LLAMA":
                        //let promptLlama = prmutil.createAskPrompt(input);
                        let promptLlama = this.getChatHistoryOllama(forum?.prompt, forum?.tableinfo, input);
                        let resultLlama = await ollamaImageChat(promptLlama, img_info.file, quest.model!); 
                        let responseLlama = resultLlama.message.content;
                        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:", responseLlama);
                        this.saveUsage(context,quest,resultLlama);
                        info.answer = this.parseAnswer(responseLlama);
                        // Do not delete image file
                        break;

                    case "GEMMA":
                        let ocrtext = await ExtractDataFromImage(img_info?.file);
                        let promptGemma = this.getChatHistoryTesseract(forum?.prompt, forum?.tableinfo, ocrtext, input);
                        let resultGemma = await ollamaGenerate(promptGemma, quest.model!);
                        let responseGemma = resultGemma.response;
                        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:", responseGemma);
                        this.saveUsage(context,quest,resultGemma);
                        info.answer = this.parseAnswer(responseGemma);    
                        // Do not delete image file
                        break;
    
                    case "LLAVA":       
                        let promptLava = prmutil.createAskPrompt(input);
                        let resultLava = await ollamaImageAsk(promptLava, quest.model!, img_info.stream!);
                        let responseLava = resultLava.response;
                        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:", responseLava);
                        this.saveUsage(context,quest,resultLava);
                        info.answer = this.parseAnswer(responseLava);
                        // Do not delete image file
                        break;
                }
            } else {
                throw new Error("Image not found");
            }
            
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

    public override async processAsk(context: KnContextInfo, quest: QuestInfo) : Promise<InquiryInfo> {
        //this api accept image parameter as image stream directly
        let img_info = this.getImageInfo(quest.mime,quest.image);
        return await this.processQuestion(context,quest,this.model,img_info);
    }

    public override async processQuestion(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model, img_info?: InlineImage) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let forum = await this.getForumConfiguration(context,quest,model);
        if(quest.async=="true") {
            this.processQuestionAsync(context,quest,forum,model,img_info).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestionAsync(context, quest, forum,  model, img_info);
    }

    public async processQuestionAsync(context: KnContextInfo, quest: QuestInfo, forum? : ForumConfig, model: KnModel = this.model, img_info?: InlineImage) : Promise<InquiryInfo> {
        let info : InquiryInfo = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: "" };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        let category = quest.category;
        if(!category || category.trim().length==0) category = "DOCFILE";
        this.logger.debug(this.constructor.name+".processQuestionAsync: quest:",quest);
        const aimodel = this.getAIModel(context);
        let db = this.getPrivateConnector(model);
        let input = quest.question;
        //let forum : ForumConfig | undefined = undefined;
        try {
            //forum = await this.getForumConfig(db,category,context);
            this.logger.debug(this.constructor.name+".processQuestionAsync: forum:",forum);
            this.logger.debug(this.constructor.name+".processQuestionAsync: correlation:",info.correlation,", category:",category+", input:",input);
            let contents = this.getImagePrompt(forum?.prompt, forum?.tableinfo);
            let hasParam = img_info;
            if(!hasParam) img_info = await this.getInlineImage(quest,db);
            console.log("img_info",img_info);
            let msg = "Question: "+quest.question;
            if(img_info) {
                contents.push({text: msg});
                contents.push(img_info);
            } else {
                contents.push({text: msg});
            }
            let result = await aimodel.generateContent(contents);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestionAsync: response:",text);
            //this.saveTokenUsage(context,quest,contents,aimodel);
            this.saveUsage(context,quest,result.response.usageMetadata);
            info.answer = this.parseAnswer(text);    
            if(!hasParam) this.deleteAttach(quest.image);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
		} finally {
			if(db) db.close();
        }
        this.logger.debug(this.constructor.name+".processQuestionAsync: return:",JSON.stringify(info));
        this.notifyMessage(info,forum).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public getImagePrompt(document?: string, prompt_info?: string) : Part[] {
        let prmutil = new PromptUtility();
        let prompt = prmutil.createChatImagePrompt(document, prompt_info);
        return [{text: prompt}];
    }

}
