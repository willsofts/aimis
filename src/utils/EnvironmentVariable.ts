import os from "os";
import config from "@willsofts/will-util";

export const PRIVATE_SECTION: string = config.env("PRIVATE_SECTION","MYSQL");
export const DB_SECTION: string = config.env("DB_SECTION","MYSQL");
export const API_KEY: string = config.env("API_KEY","");
export const API_KEY_CLAUDE: string  = config.env("API_KEY_CLAUDE","");
export const API_MODEL: string = config.env("API_MODEL","gemini-2.0-flash");
export const API_MODEL_CLAUDE: string = config.env("API_MODEL_CLAUDE","claude-3-5-sonnet-20240620");
export const API_MODEL_LLAMA: string = config.env("API_MODEL_LLAMA","gemma2");
export const API_VISION_MODEL: string = config.env("API_VISION_MODEL","gemini-2.0-flash");
export const API_ANSWER: boolean = config.env("API_ANSWER","true") === "true";
export const API_ANSWER_RECORD_NOT_FOUND: boolean = config.env("API_ANSWER_RECORD_NOT_FOUND","false") === "true";
export const API_ANSWER_CHATTER: boolean = config.env("API_ANSWER_CHATTER","true") === "true";
export const ALWAYS_REMOVE_ATTACH: boolean = config.env("ALWAYS_REMOVE_ATTACH","true") === "true";
export const ROTATE_DEGREE_OFFSET: number = parseInt(config.env("ROTATE_DEGREE_OFFSET","2")) || 2;
export const CLEANSING_TEXT: boolean = config.env("CLEANSING_TEXT","true") === "true";

export const API_OLLAMA_HOST: string = config.env("OLLAMA_HOST","http://172.31.199.54:11434");
export const API_OLLAMA_PORT: string = config.env("OLLAMA_PORT","11434");
export const API_OLLAMA_TIMEOUT: number = 600;
export const API_OLLAMA_STREAM: boolean = false;

export const UPLOAD_RESOURCES_PATH: string = config.env("UPLOAD_RESOURCES_PATH") || os.tmpdir();
export const UPLOAD_FILE_TYPES : string = config.env("UPLOAD_FILE_TYPES","jpeg|jpg|png|pdf|txt|text|csv|doc|docx|xls|xlsx");
export const UPLOAD_FILE_SIZE : number = parseInt(config.env("UPLOAD_FILE_SIZE","10485760")) || 10*1024*1024; //10MB

export const SESSION_INTERVAL : number = parseInt(config.env("SESSION_INTERVAL","1800000")) || 30*60*1000; //30min
export const SESSION_TIMEOUT : number = parseInt(config.env("SESSION_TIMEOUT","64800000")) || 18*60*60*1000; //18hr
export const MAX_EXPIRE_DATE: string = config.env("MAX_EXPIRE_DATE","31/12/9000"); 
export const MENU_TREE: boolean = config.env("MENU_TREE","true") === "true";

export const RAG_API_KEY: string = config.env("RAG_API_KEY","Z3uR+8JRx1MeZEDSpOqgPw==");
export const RAG_API_URL: string = config.env("RAG_API_URL","http://172.31.199.217:8000");
export const RAG_API_URL_UPLOAD: string = config.env("RAG_API_URL_UPLOAD","/api/rag/vector/store/file");
export const RAG_API_URL_SEARCH: string = config.env("RAG_API_URL_SEARCH","/api/rag/search/semantic");
