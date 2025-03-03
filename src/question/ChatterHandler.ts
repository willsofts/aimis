import { HTTP } from "@willsofts/will-api";
import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataSet, VerifyError } from "@willsofts/will-core";
import { PRIVATE_SECTION, API_ANSWER_CHATTER } from "../utils/EnvironmentVariable";
import { QuestInfo, InquiryInfo, ForumConfig } from "../models/QuestionAlias";
import { GenerativeHandler } from "./GenerativeHandler";
import { FilterQuestHandler, PREFIX_PROMPT, JSON_PROMPT } from "../filterquest/FilterQuestHandler";

export class ChatterHandler extends GenerativeHandler {
    public section = PRIVATE_SECTION;
    public progid = "chatter";
    public model : KnModel = { 
        name: "tfilterquest", 
        alias: { privateAlias: this.section }, 
    };
    public handlers = [ {name: "quest"}, {name: "reset"} ];

    public async reset(context: KnContextInfo) : Promise<InquiryInfo> {
        return this.callFunctional(context, {operate: "reset", raw: true}, this.doReset);
    }

    public async doReset(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        await this.validateInputFields(context, model, "category");
        return this.processResetting(context,model);
    }

    public async processResetting(context: KnContextInfo, model: KnModel) : Promise<InquiryInfo> {
        let correlation = context.params.correlation || this.createCorrelation(context);
        let category = context.params.category;
        let db = this.getPrivateConnector(model);
        try {
            //find out classify setting and categories setting
            let handler = new FilterQuestHandler();
            handler.obtain(this.broker,this.logger);
            let configure = await handler.getFilterQuestConfig(db,category,context);
            this.logger.debug(this.constructor.name+".getQuestionConfigure",configure);
            let forumlists = configure?.forumlists;
            if(forumlists && forumlists.length > 0) {
                let authtoken = this.getTokenKey(context);
                for(let forum of forumlists) {
                    if("DB"==forum.forumgroup) {
                        let params = {authtoken: authtoken, correlation: correlation, category: forum.forumid };
                        this.call("chat.reset",params).catch(ex => this.logger.error(ex));
                    } else if("NOTE"==forum.forumgroup) {
                        let params = {authtoken: authtoken, correlation: correlation, category: forum.forumid };
                        this.call("chatnote.reset",params).catch(ex => this.logger.error(ex));
                    }
                }
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
        } finally {
            if(db) db.close();
        }
        return Promise.resolve({ questionid: "", correlation: correlation, category: category, classify: "", error: false, statuscode: "", question: "reset", query: category, answer: "OK", dataset: [] });
    }

    public async processReset(category: string, correlation: string) : Promise<InquiryInfo> {
        return Promise.resolve({ questionid: "", correlation: correlation, category: category, classify: "", error: false, statuscode: "", question: "reset", query: category, answer: "OK", dataset: [] });
    }

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
        let [info, configure, prompts] = await this.getQuestionConfigure(context, quest, model);
        if(info.error) {
            return Promise.resolve(info);
        }        
        if(String(quest.async)=="true") {
            this.processQuestGeminiAsync(context, quest, configure || {}, prompts).catch((ex) => console.error(ex));
            return Promise.resolve(info);
        }
        return await this.processQuestGeminiAsync(context, quest, configure || {}, prompts);    
    }

    public async getQuestionConfigure(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<[InquiryInfo, KnDataSet | undefined, string]> {
        let prompts = "";
        let configure : KnDataSet | undefined = undefined;        
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.category, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return [info, configure, prompts];
        }
        if(!quest.category || quest.category.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-CATEGORY";
            info.answer = "No category found.";
            return [info, configure, prompts];
        }        
        let db = this.getPrivateConnector(model);
        try {
            //find out classify setting and categories setting
            let handler = new FilterQuestHandler();
            handler.obtain(this.broker,this.logger);
            configure = await handler.getFilterQuestConfig(db,quest.category,context);
            this.logger.debug(this.constructor.name+".getQuestionConfigure",configure);
            if(!configure) {
                info.error = true;
                info.statuscode = "NO-CONFIG";
                info.answer = "No configuration found.";
                return [info, configure, prompts];
            }
            prompts = await this.createClassifyPrompt(configure);
            if(!prompts) {
                info.error = true;
                info.statuscode = "NO-CLASS";
                info.answer = "No classify prompt found.";
                return [info, configure, prompts];
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        } finally {
            if(db) db.close();
        }
        return [info, configure, prompts];
    }

    public async processQuestGeminiAsync(context: KnContextInfo, quest: QuestInfo, configure: KnDataSet, prompts: string) : Promise<InquiryInfo> {
        let callingflag = false;
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.category, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let forumcfg = await this.createForumConfig(configure);
        try {
            let promptcontents = [{text: quest.question},{ text: prompts }];
            this.logger.debug(this.constructor.name+".processQuest: prompt contents:",promptcontents);
            const aimodel = this.getAIModel(context);
            let result = await aimodel.generateContent(promptcontents);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuest: response:",text);
            this.saveTokenUsage(context,quest,promptcontents,aimodel);
            let jsonstr = this.parseJSONAnswer(text);
            let json = undefined;
            try { json = JSON.parse(jsonstr); } catch(ex) { this.logger.error(ex); }
            if(!json) {
                info.error = true;
                info.answer = jsonstr;
            } else {
                this.logger.debug(this.constructor.name+".processQuest: json answer",json); 
                if(!json.category_name || json.category_name.trim().length==0) {
                    if(API_ANSWER_CHATTER) {
                        result = await aimodel.generateContent(quest.question);
                        response = result.response;
                        text = response.text();
                        this.logger.debug(this.constructor.name+".processQuest: response:",text);
                        this.saveTokenUsage(context,quest,quest.question,aimodel);
                        info.answer = this.parseAnswer(text);
                    } else {
                        info.error = true;
                        info.answer = json.category_feedback || "Cannot classify question into category";
                    }
                } else {
                    let forum = configure.forumlists.find((item:any) => item.forumid == json.category_name);
                    this.logger.debug(this.constructor.name+".processQuest: forum",forum);
                    if(forum) {
                        let params = {...quest, query: quest.question, question: "", authtoken: this.getTokenKey(context), hookflag: forumcfg?.hookflag, webhook: forumcfg?.webhook };
                        params.agent = configure.agent;
                        params.category = json.category_name;
                        params.classify = info.category;
                        if(forum.forumgroup=="DB") {
                            callingflag = true;
                            info = await this.call("chat.quest",params);
                        } else if(forum.forumgroup=="NOTE") {
                            callingflag = true;
                            info = await this.call("chatnote.quest",params);    
                        } else {
                            info.error = true;
                            info.statuscode = "NO-SUPPORT";
                            info.answer = "Not suppport service type";
                        }
                    } else {
                        info.error = true;
                        info.statuscode = "NO-KNOWN";
                        info.answer = "Not known setting";
                    }
                }
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        }
        this.logger.debug(this.constructor.name+".processQuest: return:",JSON.stringify(info));
        if(!callingflag) this.notifyMessage(info,forumcfg).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public async createForumConfig(configure: KnDataSet) : Promise<ForumConfig | undefined> {
        return { 
            hookflag: configure?.hookflag, webhook: configure?.webhook,
            schema: "", alias: "", dialect: "", url: "", user: "", password: "", 
            caption: "", title: "", type: "", tableinfo: "",
        };
    }

    public async createClassifyPrompt(configure: KnDataSet) : Promise<string> {
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
