import { QuestionUtility } from "../question/QuestionUtility";

let texts = `
\`\`\`json
{"answer": "this is the answer"}
\`\`\``;
console.log("texts:",texts);
let answer = QuestionUtility.parseJSONAnswer(texts);
console.log("answer",answer); //=> "this is the answer"

texts = `
\`\`\`
{"answer": "this is the answer"}
\`\`\``;
console.log("texts:",texts);
answer = QuestionUtility.parseJSONAnswer(texts);
console.log("answer",answer); //=> {"answer": "this is the answer"}

texts = `
\`\`\`json
{
        "category_name": "bfd7d59e-5a5b-41ac-9b2b-873cfc84712b",
        "category_feedback": "BBL สามารถหมายถึงได้หลายอย่างครับ เพื่อให้ผมตอบคำถามได้ตรงประเด็น รบกวนระบุเพิ่มเติมได้ไหมครับว่าคุณต้องการทราบเกี่ยวกับอะไร \n\nตัวอย่างเช่น:\n*   **BBL** อาจหมายถึง ธนาคารกรุงเทพ จำกัด (มหาชน) ซึ่งเป็นธนาคารพาณิชย์ของไทย\n*   **BBL** อาจหมายถึง Brazilian Butt Lift ซึ่งเป็นการผ่าตัดเสริมสะโพก\n*   **BBL** อาจเป็นคำย่ออื่น ๆ ที่ใช้ในบริบทเฉพาะ"
}
\`\`\``;
console.log("texts:",texts);
answer = QuestionUtility.parseJSONAnswer(texts);
console.log("answer",answer); 
