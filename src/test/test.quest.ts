import { QuestionHandler } from "../question/QuestionHandler";

const input = "Find out best seller of 5 products in March,2024 ?";
const handler = new QuestionHandler();
handler.processQuestion({params:{},meta:{}},{async: "", questionid: "", question: input, category: "AIDB1", mime: "", image: "", correlation: "12345", classify: "", property: ""}).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});
