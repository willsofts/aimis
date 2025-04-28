import { ChatNoteHandler } from "../question/ChatNoteHandler";
import { Arguments } from "@willsofts/will-util";

const args = process.argv.slice(2);
let agent = Arguments.getString(args,"GEMINI","-a","-agent") as string;
let id = Arguments.getString(args,"ea2af6a0-201f-11f0-beed-00090ffe0001","-id") as string;
let input = Arguments.getString(args,"เดือนพฤษภาคมมีวันหยุดกี่วัน","-q","-query") as string;

const handler = new ChatNoteHandler();
handler.quest({params: { agent: agent, category: id, query: input}, meta: {}}).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});

//node dist/test/test.note.js -id ea2af6a0-201f-11f0-beed-00090ffe0001 -q "เดือนพฤษภาคมมีวันหยุดกี่วัน"

