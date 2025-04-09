import { QuestionUtility } from "../question/QuestionUtility";

let texts = `
\`\`\`json
{"answer": "this is the answer"}
\`\`\``;
console.log("texts:",texts);
let answer = QuestionUtility.parseAnswer(texts);
console.log("answer",answer); //=> "this is the answer"

texts = `
\`\`\`
{"answer": "this is the answer"}
\`\`\``;
console.log("texts:",texts);
answer = QuestionUtility.parseAnswer(texts);
console.log("answer",answer); //=> {"answer": "this is the answer"}

texts = `Answer: "this is the answer"}`;
console.log("texts:",texts);
answer = QuestionUtility.parseAnswer(texts);
console.log("answer",answer); //=> {"answer": "this is the answer"}
