import { KnModel } from "@willsofts/will-db";
import { KnContextInfo } from "@willsofts/will-core";
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { QuestionUtility } from "./QuestionUtility";
import { QuestInfo, InquiryInfo } from "../models/QuestionAlias";
import { GenerativeHandler } from "./GenerativeHandler";

export class VisionHandler extends GenerativeHandler {
    public section = PRIVATE_SECTION;
    public progid = "vision";
    public model : KnModel = { 
        name: "tvision", 
        alias: { privateAlias: this.section }, 
    };
    public handlers = [ {name: "quest"}, {name: "ask"} ];

    public override async doQuest(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let questionid = context.params.questionid || "";
        return await this.processQuest(context,{async: context.params.async, questionid: questionid, category: context.params.category, question: context.params.query, mime: context.params.mime, image: context.params.image, agent: context.params.agent, model: context.params.model || "", imageocr: context.params.imageocr, imagetmp: context.params.imagetmp, correlation: correlationid, classify: context.params.classify, property: context.params.property },model);
    }

    public override async doAsk(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let questionid = context.params.questionid || "";
        return await this.processAsk(context,{async: context.params.async, questionid: questionid, category: context.params.category, question: context.params.query, mime: context.params.mime, image: context.params.image,agent: context.params.agent, model: context.params.model || "", correlation: correlationid, classify: context.params.classify, property: context.params.property});
    }

    public async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        return await this.processQuestion(context,quest);
    }

    public async processQuestion(context: KnContextInfo = this.getContext(), quest: QuestInfo) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processQuestionAsync(context, quest).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestionAsync(context, quest);
    }

    public async processQuestionAsync(context: KnContextInfo, quest: QuestInfo) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let valid = this.validateParameter(quest.question,quest.mime,quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        try {
            const aimodel = this.getAIModel(context);
            let input = quest.question;
            let image_info = this.getImageInfo(quest.mime,quest.image);
            this.logger.debug(this.constructor.name+".processQuestion: correlation:",info.correlation,", input:",input);
            let result = await aimodel.generateContent([input, image_info]);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestion: response:",text);
            this.saveUsage(context,quest,result.response.usageMetadata);
            info.answer = QuestionUtility.trime(text);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuestion: return:",JSON.stringify(info));
        return info;
    }

    public async processAsk(context: KnContextInfo, quest: QuestInfo) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let valid = this.validateParameter(quest.question,"img",quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        if(String(quest.async)=="true") {
            this.processAskAsync(context,quest).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processAskAsync(context,quest);
    }

    public async processAskAsync(context: KnContextInfo, quest: QuestInfo) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.classify, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let valid = this.validateParameter(quest.question,"img",quest.image);
        if(!valid.valid) {
            info.error = true;
            info.statuscode = "NO-VALID";
            info.answer = "No "+valid.info+" found.";
            return Promise.resolve(info);
        }
        try {
            let image_info = await this.getAttachImageInfo(quest.image);
            if(image_info == null) {    
                info.error = true;
                info.statuscode = "NO-IMAGE";
                info.answer = "No image info found.";
                return Promise.resolve(info);
            }
            const aimodel = this.getAIModel(context);
            let input = quest.question;
            this.logger.debug(this.constructor.name+".processAsk: input:",input);
            let result = await aimodel.generateContent([input, image_info]);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processAsk: response:",text);
            this.saveUsage(context,quest,result.response.usageMetadata);
            info.answer = QuestionUtility.trime(text);
            this.deleteAttach(quest.image);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processAsk: return:",JSON.stringify(info));
        return info;
    }

}
