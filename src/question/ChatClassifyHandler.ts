import { HTTP } from "@willsofts/will-api";
import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataSet, VerifyError } from "@willsofts/will-core";
import { PRIVATE_SECTION } from "../utils/EnvironmentVariable";
import { QuestInfo, InquiryInfo } from "../models/QuestionAlias";
import { GenerativeHandler } from "./GenerativeHandler";
import { FilterQuestHandler, PREFIX_PROMPT, JSON_PROMPT } from "../filterquest/FilterQuestHandler";

export class ChatClassifyHandler extends GenerativeHandler {
    public section = PRIVATE_SECTION;
    public progid = "chatclassify";
    public model : KnModel = { 
        name: "tfilterquest", 
        alias: { privateAlias: this.section }, 
    };
    public handlers = [ {name: "quest"} ];

    public override async doQuest(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        let correlationid = context.params.correlation || this.createCorrelation(context);
        let questionid = context.params.questionid || "";
        return await this.processQuest(context,{async: context.params.async, questionid: questionid, category: context.params.category, question: context.params.query, mime: context.params.mime, image: context.params.image, agent: context.params.agent, model: context.params.model || "", imageocr: context.params.imageocr, imagetmp: context.params.imagetmp, correlation: correlationid, classify: context.params.classify, property: context.params.property },model);
    }

    public async processQuest(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        if(quest.agent=="GEMINI") {
            return await this.processQuestGemini(context, quest, model);
        }
        return await this.processQuestGemini(context, quest, model);        
    }

    public async processQuestGemini(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(!quest.category || quest.category.trim().length == 0) {
            info.error = true;
            info.answer = "No category found.";
            return Promise.resolve(info);
        }        
        if(quest.async=="true") {
            this.processQuestGeminiAsync(context, quest).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestGeminiAsync(context, quest);    
    }

    public async processQuestGeminiAsync(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<InquiryInfo> {
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, error: false, question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.answer = "No question found.";
            return Promise.resolve(info);
        }
        if(!quest.category || quest.category.trim().length == 0) {
            info.error = true;
            info.answer = "No category found.";
            return Promise.resolve(info);
        }        
        let db = this.getPrivateConnector(model);
        try {
            //find out classify setting and categories setting
            let handler = new FilterQuestHandler();
            handler.obtain(this.broker,this.logger);
            let configure = await handler.getFilterQuestConfig(db,quest.category,context);
            console.log("configure",configure);
            if(!configure) {
                info.error = true;
                info.answer = "No configuration found.";
                return Promise.resolve(info);    
            }
            let prompts = await this.createClassifyPrompt(configure);
            if(!prompts) {
                info.error = true;
                info.answer = "No classify prompt found.";
                return Promise.resolve(info);    
            }
            let promptcontents = [{text: quest.question},{ text: prompts }];
            this.logger.debug(this.constructor.name+".processQuest: prompt contents:",promptcontents);
            const aimodel = this.getAIModel(context);
            let result = await aimodel.generateContent(promptcontents);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuest: response:",text);
            this.saveTokenUsage(context,quest,promptcontents,aimodel);
            let jsonstr = this.parseJSONAnswer(text);
            let json = JSON.parse(jsonstr);
            this.logger.debug(this.constructor.name+".processQuest: json answer",json); 
            if(!json.category_name || json.category_name.trim().length==0) {
                info.error = true;
                info.answer = json.category_feedback || "Cannot classify question into category";
                return Promise.resolve(info);    
            }
            let forum = configure.forumlists.find((item:any) => item.forumid == json.category_name);
            this.logger.debug(this.constructor.name+".processQuest: forum",forum);
            if(forum) {
                let params = {...quest, query: quest.question, question: "", authtoken: this.getTokenKey(context) };
                params.agent = configure.agent;
                params.category = json.category_name;
                params.classify = info.category;
                if(forum.forumgroup=="DB") {
                    info = await this.call("chat.quest",params);
                } else if(forum.forumgroup=="NOTE") {
                    info = await this.call("chatnote.quest",params);    
                } else {
                    info.error = true;
                    info.answer = "Not known service type";
                    return Promise.resolve(info);        
                }
            } else {
                info.error = true;
                info.answer = "Not known setting";
                return Promise.resolve(info);    
            }
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

    public async createClassifyPrompt(configure: KnDataSet) : Promise<string | undefined> {
        let categories = new Array<string>();
        let forumlists = configure?.forumlists;
        if(forumlists && forumlists.length > 0) {
            let index = 0;
            for(let row of forumlists) {
                let classifyprompt = row.classifyprompt;
                if(classifyprompt && classifyprompt.trim().length > 0) {
                    index++;
                    let text = index+". category_name: "+row.forumid;
                    text += "\n"+classifyprompt.trim()+"\n\n";
                    categories.push(text);
                }
            }
        } 
        if(categories.length == 0) {
            return Promise.reject(new VerifyError("Classify categories not found",HTTP.NOT_FOUND,-16004));
        }
        let prefixprompt = configure.prefixprompt;
        let suffixprompt = configure.suffixprompt;
        let jsonprompt = configure.jsonprompt;
        let skillprompt = configure.skillprompt;
        if(!prefixprompt || prefixprompt.trim().length == 0) prefixprompt = PREFIX_PROMPT;
        if(!jsonprompt || jsonprompt.trim().length == 0) jsonprompt = JSON_PROMPT;
        //compose filter prompt by categories, this prompt return known json format
        let prompt = "\n"+prefixprompt+"\n\n";
        categories.forEach(item => { prompt += item; });
        prompt += "\n\n";
        if(suffixprompt) prompt += suffixprompt+"\n";
        prompt += jsonprompt;
        if(skillprompt && skillprompt.trim().length > 0) {
            prompt += "\n";
            prompt += skillprompt;
        }
        return prompt;
    }

}
