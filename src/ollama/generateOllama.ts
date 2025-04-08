import { Ollama, Message } from 'ollama'
import { API_OLLAMA_HOST, API_OLLAMA_TIMEOUT } from "../utils/EnvironmentVariable";
import { ChatSession, Content } from "@google/generative-ai";
import { API_KEY, API_MODEL } from "../utils/EnvironmentVariable";

export class LlamaSession extends ChatSession {
    public history : Content[] = new Array<Content>();
    constructor(apiKey: string = API_KEY, model: string = API_MODEL) {
        super(apiKey,model);
    }
    public override getHistory(): Promise<Content[]> {
        return Promise.resolve(this.history);
    }
    public add(contents: Content[]) {
        if(!contents) return;
        this.history = this.history.concat(contents);
    }
}

export class OllamaObj {

    private static _instance: OllamaObj;
    private _ollama = new Ollama({ host: API_OLLAMA_HOST })
    
    public static getInstance() : OllamaObj {
        if(!this._instance) this._instance = new OllamaObj();
        return this._instance;;
    }
    constructor() {
        if (!OllamaObj._instance) {
            OllamaObj._instance = this;
        }
        return OllamaObj._instance;
    }
    public ollama() : Ollama | undefined {
        return this._ollama;
    }
}

export async function ollamaCreateModel(systemPrompt: string, title: string) {
    console.log("Create Model File");
    try {
        const modelfile = `
        FROM llama3.1
        PARAMETER temperature 1
        SYSTEM """
        ${systemPrompt}
        """
        `
        await OllamaObj.getInstance().ollama()?.create({ model: title, modelfile: modelfile })
    }
    catch(ex: any){
        console.log(ex.message);
    }
}

export async function ollamaChat(systemPrompt: string, userPrompt: string, model: string, chat?: LlamaSession): Promise<any> {
    try {
        let histories : Message[] = [];
        let texts = systemPrompt;
        if(chat) {
            if(chat.history.length==0) {
                chat.history.push({ role: "system", parts: [{text: texts}] });
            }
            chat.history.push({ role: "user", parts: [{text: userPrompt}] });
            chat.history.forEach((item:Content,index:number) => {
                histories.push({ role: item.role, content: item.parts[0].text as string});
            });
        } else {
            histories.push({ role: "system", content: texts });
            histories.push({ role: "user", content: userPrompt });
        }
        const response = await OllamaObj.getInstance().ollama()?.chat({
        model: model!,
        keep_alive: API_OLLAMA_TIMEOUT,
        messages: histories,
        });
        let contents = [
            { role: "assistant", parts: [{text: response?.message?.content as string }] }
        ];
        if(chat) {
            chat.add(contents);
        }
        return response;
    }
    catch(ex: any) {
        console.error(ex.message);
        return Promise.reject(ex);
    }
}

export async function ollamaGenerate(prompt: string, model: string): Promise<any> {
    let response = OllamaObj.getInstance().ollama()?.generate({
        model: model!,
        keep_alive: API_OLLAMA_TIMEOUT,
        prompt: prompt,
        stream: false
    });
    return response;
}

//Llava
export async function ollamaImageAsk(prompt: string, model: string, imgbase64: string): Promise<any>{
    let response = OllamaObj.getInstance().ollama()?.generate({
        model: model!,
        keep_alive: API_OLLAMA_TIMEOUT,
        prompt: prompt,
        images: [ imgbase64 ],
        stream: false
    });
    return response;
}

//Llama
export async function ollamaImageChat(userPrompt: string, image: string,  model: string): Promise<any> {
    let response = OllamaObj.getInstance().ollama()?.chat({
        model: model!,
        keep_alive: API_OLLAMA_TIMEOUT,
        messages: [
            { role: 'user', content: userPrompt, images: [ image ] }
        ],
    });    
    return response;
}
