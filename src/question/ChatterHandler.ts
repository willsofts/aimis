import { HTTP } from "@willsofts/will-api";
import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataSet, VerifyError } from "@willsofts/will-core";
import { PRIVATE_SECTION, API_ANSWER_CHATTER, API_MODEL, API_MODEL_LLAMA, RAG_API_ASYNC } from "../utils/EnvironmentVariable";
import { QuestInfo, InquiryInfo, ForumConfig, QuestConfigureInfo } from "../models/QuestionAlias";
import { GenerativeHandler } from "./GenerativeHandler";
import { FilterQuestHandler, PREFIX_PROMPT, JSON_PROMPT } from "../filterquest/FilterQuestHandler";
import { PromptOLlamaUtility } from "./PromptOLlamaUtility";
import { ollamaGenerate } from "../ollama/generateOllama";

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
            this.logger.debug(this.constructor.name+".processResetting",configure);
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
            return await this.processQuestGemini(context, quest, undefined, model);
        } else if(quest.agent=="GEMMA" || quest.agent=="LLAMA") {
            return await this.processQuestOllama(context, quest, undefined, model);
        }
        let cfg = await this.getQuestionConfigure(context, quest, model);
        this.logger.debug(this.constructor.name+".processQuest: cfg",cfg);
        if(cfg.info.error) {
            return Promise.resolve(cfg.info);
        }
        if(cfg.configure) {
            quest.agent = cfg.configure.agentid;
            if(quest.agent=="GEMINI") {
                return await this.processQuestGemini(context, quest, cfg, model);
            } else if(quest.agent=="GEMMA" || quest.agent=="LLAMA") {
                return await this.processQuestOllama(context, quest, cfg, model);
            }
        }        
        return await this.processQuestGemini(context, quest, cfg, model);        
    }

    public async processQuestGemini(context: KnContextInfo, quest: QuestInfo, cfg: QuestConfigureInfo | undefined, model: KnModel = this.model) : Promise<InquiryInfo> {
        if(!cfg) {
            cfg = await this.getQuestionConfigure(context, quest, model);
            if(cfg.info.error) {
                return Promise.resolve(cfg.info);
            } 
        }       
        if(String(quest.async)=="true") {
            this.processQuestGeminiAsync(context, quest, cfg).catch((ex) => console.error(ex));
            return Promise.resolve(cfg.info);
        }
        return await this.processQuestGeminiAsync(context, quest, cfg);    
    }

    public async processQuestOllama(context: KnContextInfo, quest: QuestInfo, cfg: QuestConfigureInfo | undefined, model: KnModel = this.model) : Promise<InquiryInfo> {
        if(!cfg) {
            cfg = await this.getQuestionConfigure(context, quest, model);
            if(cfg.info.error) {
                return Promise.resolve(cfg.info);
            }
        }        
        if(String(quest.async)=="true") {
            this.processQuestOllamaAsync(context, quest, cfg).catch((ex) => console.error(ex));
            return Promise.resolve(cfg.info);
        }
        return await this.processQuestOllamaAsync(context, quest, cfg);
    }

    public async getQuestionConfigure(context: KnContextInfo, quest: QuestInfo, model: KnModel = this.model) : Promise<QuestConfigureInfo> {
        let prompts = "";
        let configure : KnDataSet | undefined = undefined;        
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.category, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        if(!quest.question || quest.question.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-QUEST";
            info.answer = "No question found.";
            return { info: info, configure: configure, prompts: prompts };
        }
        if(!quest.category || quest.category.trim().length == 0) {
            info.error = true;
            info.statuscode = "NO-CATEGORY";
            info.answer = "No category found.";
            return { info: info, configure: configure, prompts: prompts };
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
                return { info: info, configure: configure, prompts: prompts };
            }
            prompts = await this.createClassifyPrompt(configure);
            if(!prompts) {
                info.error = true;
                info.statuscode = "NO-CLASS";
                info.answer = "No classify prompt found.";
                return { info: info, configure: configure, prompts: prompts };
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            info.error = true;
            info.statuscode = "ERROR";
            info.answer = this.getDBError(ex).message;
        } finally {
            if(db) db.close();
        }
        return { info: info, configure: configure, prompts: prompts };
    }

    public async processQuestGeminiAsync(context: KnContextInfo, quest: QuestInfo, cfg: QuestConfigureInfo) : Promise<InquiryInfo> {
        let callingflag = false;
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.category, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let configure = cfg.configure || {};
        let prompts = cfg.prompts;
        let forumcfg = await this.createForumConfig(configure);
        try {
            quest.model = quest.model || API_MODEL;
            let promptcontents = [{text: quest.question},{ text: prompts }];
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: prompt contents:",promptcontents);
            this.logging(context,quest,[quest.question,prompts]);
            const aimodel = this.getAIModel(context);
            let result = await aimodel.generateContent(promptcontents);
            let response = result.response;
            let text = response.text();
            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: response:",text);            
            //this.saveTokenUsage(context,quest,promptcontents,aimodel);
            this.saveUsage(context,quest,result.response.usageMetadata);
            this.logging(context,quest,[text]);
            let jsonstr = this.parseJSONAnswer(text);
            let json = undefined;
            try { json = JSON.parse(jsonstr); } catch(ex) { this.logger.error("parse json error",ex,"json string",jsonstr); }
            if(!json) {
                info.error = true;
                info.answer = jsonstr;
            } else {
                let forum;
                let checkforum = false;
                this.logger.debug(this.constructor.name+".processQuestGeminiAsync: json answer",json); 
                if(!json.category_name || json.category_name.trim().length==0) {
                    forum = configure.forumlists.find((item:any) => item.defaultflag == "1");
                    this.logger.debug(this.constructor.name+".processQuestGeminiAsync: category not found using default forum",forum);
                    if(!forum) {
                        if(API_ANSWER_CHATTER) {
                            this.logging(context,quest,[quest.question]);
                            result = await aimodel.generateContent(quest.question);
                            response = result.response;
                            text = response.text();
                            this.logger.debug(this.constructor.name+".processQuestGeminiAsync: response:",text);
                            //this.saveTokenUsage(context,quest,quest.question,aimodel);
                            this.saveUsage(context,quest,result.response.usageMetadata);
                            this.logging(context,quest,[text]);
                            info.answer = this.parseAnswer(text);
                        } else {
                            info.error = true;
                            info.answer = json.category_feedback || "Cannot classify question into category";
                        }
                    } else {
                        checkforum = true;
                    }
                } else {
                    checkforum = true;
                    forum = configure.forumlists.find((item:any) => item.forumid == json.category_name);
                    this.logger.debug(this.constructor.name+".processQuestGeminiAsync: find forum from category",json.category_name,"forum",forum);
                }
                if(checkforum) {
                    if(forum) {
                        let params : any = {...quest, query: quest.question, question: "", hookflag: forumcfg?.hookflag, webhook: forumcfg?.webhook };
                        params.agent = configure?.agentid || quest.agent || "GEMINI";
                        params.category = forum.forumid;
                        params.classify = info.category;
                        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: params",params);
                        params.authtoken = this.getTokenKey(context);
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
        this.logger.debug(this.constructor.name+".processQuestGeminiAsync: return:",JSON.stringify(info));
        if(!callingflag) this.notifyMessage(info,forumcfg).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public async processQuestOllamaAsync(context: KnContextInfo, quest: QuestInfo, cfg: QuestConfigureInfo) : Promise<InquiryInfo> {
        let callingflag = false;
        let info = { questionid: quest.questionid, correlation: quest.correlation, category: quest.category, classify: quest.category, error: false, statuscode: "", question: quest.question, query: "", answer: "", dataset: [] };
        let configure = cfg.configure || {};
        let prompts = cfg.prompts;
        let forumcfg = await this.createForumConfig(configure);
        try {
            quest.model = quest.model || API_MODEL_LLAMA;
            let prmutil = new PromptOLlamaUtility();
            let prompt = prmutil.createChatDocumentPrompt(quest.question, prompts);
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: prompt:",prompt);
            this.logging(context,quest,[prompt]);
            let result = await ollamaGenerate(prompt, quest.model);
            let text = result.response; 
            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:", text);
            this.logging(context,quest,[text]);
            let jsonstr = this.parseJSONAnswer(text);
            let json = undefined;
            try { json = JSON.parse(jsonstr); } catch(ex) { this.logger.error("parse json error",ex,"json string",jsonstr); }
            if(!json) {
                info.error = true;
                info.answer = jsonstr;
            } else {
                let forum;
                let checkforum = false;
                this.logger.debug(this.constructor.name+".processQuestOllamaAsync: json answer",json); 
                if(!json.category_name || json.category_name.trim().length==0) {
                    forum = configure.forumlists.find((item:any) => item.defaultflag == "1");
                    this.logger.debug(this.constructor.name+".processQuestOllamaAsync: category not found using default forum",forum);
                    if(!forum) {
                        if(API_ANSWER_CHATTER) {
                            this.logging(context,quest,[quest.question]);
                            result = await ollamaGenerate(quest.question, quest.model);
                            text = result.response;
                            this.logger.debug(this.constructor.name+".processQuestOllamaAsync: response:",text);
                            this.logging(context,quest,[text]);
                            info.answer = this.parseAnswer(text);
                        } else {
                            info.error = true;
                            info.answer = json.category_feedback || "Cannot classify question into category";
                        }
                    } else {
                        checkforum = true;
                    }
                } else {
                    checkforum = true;
                    forum = configure.forumlists.find((item:any) => item.forumid == json.category_name);
                    this.logger.debug(this.constructor.name+".processQuestOllamaAsync: find forum from category",json.category_name,"forum",forum);
                }
                if(checkforum) {
                    if(forum) {
                        let params : any = {...quest, query: quest.question, question: "", hookflag: forumcfg?.hookflag, webhook: forumcfg?.webhook };
                        params.agent = configure?.agentid || quest.agent || "LLAMA";
                        params.category = forum.forumid;
                        params.classify = info.category;
                        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: params",params);
                        params.authtoken = this.getTokenKey(context);
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
        this.logger.debug(this.constructor.name+".processQuestOllamaAsync: return:",JSON.stringify(info));
        if(!callingflag) this.notifyMessage(info,forumcfg).catch(ex => this.logger.error(this.constructor.name,ex));
        return info;
    }

    public async createForumConfig(configure: KnDataSet) : Promise<ForumConfig | undefined> {
        return { 
            hookflag: configure?.hookflag, webhook: configure?.webhook,
            schema: "", alias: "", dialect: "", url: "", user: "", password: "", 
            caption: "", title: "", type: "", tableinfo: "", ragasync: RAG_API_ASYNC,
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
