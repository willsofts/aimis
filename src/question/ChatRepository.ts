import { ChatSession } from "@google/generative-ai";
import { SESSION_INTERVAL, SESSION_TIMEOUT } from "../utils/EnvironmentVariable";

export class ChatCleansing {
    private static _cleaner : ChatCleansing;
    public interval: number = SESSION_INTERVAL;
    public timeout: number = SESSION_TIMEOUT;
    public cleanTimer : NodeJS.Timeout | undefined = undefined;
    constructor() {        
        if(!ChatCleansing._cleaner) {
            ChatCleansing._cleaner = this;
        }
        return ChatCleansing._cleaner;
    }
    public static getInstance() : ChatCleansing {
        if(!this._cleaner) this._cleaner = new ChatCleansing();
        return this._cleaner;
    }
    public start() {
        this.cleanTimer = setInterval(() => { this.run(); },this.interval);
    }
    public stop() {
        if(this.cleanTimer) {
            clearInterval(this.cleanTimer)
        }
    }
    private run() {
        let now = new Date();
        let curmillis = now.getTime();
        let store = ChatStore.getInstance();
        let found = false;
        console.log("["+now.toISOString()+"] INFO ",this.constructor.name+".run: "+curmillis,now);
        do {
            found = false;
            store.storemap.forEach((repo,key) => {
                if(repo.expired(this.timeout,curmillis)) {
                    console.log("["+now.toISOString()+"] INFO ",this.constructor.name+".run: "+key+" expired.");
                    found = true;
                    repo.clear(); 
                    store.remove(key); 
                    return false;
                }
            });
        } while(found);
    }
}

export class ChatStore {
    private static _cleanser = ChatStore.startCleansing();
    private static _store : ChatStore;
    public storemap = new Map<string,ChatRepository>();
    constructor() {
        if(!ChatStore._store) {
            ChatStore._store = this;
        }
        return ChatStore._store;
    }
    public static getInstance() : ChatStore {
        if(!this._store) this._store = new ChatStore();
        return this._store;
    }
    public get(storeid: string) : ChatRepository | undefined {
        console.log("ChatStore: get store:",storeid,", keys:",Array.from(this.storemap.keys()));
        return this.storemap.get(storeid);
    }
    public set(storeid: string, store: ChatRepository) {
        this.storemap.set(storeid,store);
    }
    public remove(storeid: string) : boolean {
        return this.storemap.delete(storeid);
    }
    public size() : number {
        return this.storemap.size;
    }
    private static startCleansing() : ChatCleansing {
        console.log("["+new Date().toISOString()+"] INFO  ChatRepository: start cleansing ...");
        let cleansing = ChatCleansing.getInstance();
        cleansing.start();
        return cleansing;
    }
    public static stopCleansing() {
        this._cleanser?.stop();
    }
}

export class ChatRepository {
    public timemillis : number;
    public chatmap = new Map<string,ChatSession>();
    constructor() {
        this.timemillis = new Date().getTime();
    }
    public static getInstance(repoid: string) : ChatRepository {
        let store = ChatStore.getInstance();
        let repo = store.get(repoid);
        if(!repo) {
            repo = new ChatRepository();
            store.set(repoid,repo);
        }
        repo.refresh();
        return repo;
    }
    public refresh() {
        this.timemillis = new Date().getTime();
    }
    public get(category: string) : ChatSession | undefined {
        console.log("ChatRepository: get repo:",category,", keys:",Array.from(this.chatmap.keys()));
        return this.chatmap.get(category);
    }
    public set(category: string, chat: ChatSession) {
        this.chatmap.set(category, chat);
    }
    public remove(category: string) : boolean {
        return this.chatmap.delete(category);
    }
    public size() : number {
        return this.chatmap.size;
    }
    public clear() {
        this.chatmap.clear();
    }
    public expired(timeout: number, curmillis: number = new Date().getTime()) : boolean {
        return (curmillis - this.timemillis) >= timeout;
    }
}
