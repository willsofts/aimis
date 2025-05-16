import { v4 as uuid } from 'uuid';
import { API_MODEL } from "../utils/EnvironmentVariable";
import { QuestionHandler } from "../question/QuestionHandler";
import { Arguments } from "@willsofts/will-util";

const args = process.argv.slice(2);
let quest = { 
    async: "", questionid: "", 
    question: Arguments.getString(args,"List best 10 actors in 2021 ?","-input") as string, 
    category: "", mime: "", image: "", 
    agent: Arguments.getString(args,"GEMINI","-agent","-a") as string, 
    model: Arguments.getString(args,API_MODEL,"-model","-m") as string, 
    correlation: uuid() };
const handler = new QuestionHandler();
handler.processAsk({params:{},meta:{}},quest).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});

//node dist/test/test.ask.js
//node dist/test/test.ask.js -agent GEMMA -model gemma2
//node dist/test/test.ask.js -agent LLAMA -model llama3.1
