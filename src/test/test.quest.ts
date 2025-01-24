import { QuestionHandler } from "../question/QuestionHandler";

const input = "Find out best seller of 5 products in March,2024 ?";
const handler = new QuestionHandler();
handler.processQuestion({async: "", questionid: "", question: input, category: "AIDB1", mime: "", image: "", correlation: "12345", property: ""}).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});
