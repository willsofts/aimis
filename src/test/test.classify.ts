
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { KnContextInfo } from '@willsofts/will-core';
import { Arguments } from "@willsofts/will-util";
import { QuestionUtility } from "../question/QuestionUtility";
import { API_KEY, API_MODEL } from "../utils/EnvironmentVariable";

const prompt_texts = `
Try to classify the question into the following categories:

1. category_name: AIDB1
This category the question asks about product selling.

2. category_name: AIDB2
This category the question asks about course training.

3. category_name: AIDB3
This category the question asks about employee leave.


After classified the question then answer in JSON data with the following format (with out mark down code):
    {
        category_name: "The category_name found from defined categories ex. 'Category1', but if not found then let null",
        category_feedback: "In case of not found from defined categories then try to feedback by answer the question ex. your question out of scope, otherwise let it null",
    }

`;

const genAI = new GoogleGenerativeAI(API_KEY);

class TestClassify {

    public getAIModel(context?: KnContextInfo) : GenerativeModel {
        let model = context?.params?.model;
        if(!model || model.trim().length==0) model = API_MODEL;
        return genAI.getGenerativeModel({ model: model,  generationConfig: { temperature: 0 }});
    }

    public async createFilterPrompt() {
        return prompt_texts;
    }

    public parseJSONAnswer(answer: string) : string {
        return QuestionUtility.parseJSONAnswer(answer);
    }

    public async classify(input: string) {
        let prompt = await this.createFilterPrompt();
        let promptcontents = [{text: input},{ text: prompt }];
        console.log("promp contents:",promptcontents);
        const aimodel = this.getAIModel();
        let result = await aimodel.generateContent(promptcontents);
        let response = result.response;
        let text = response.text();
        console.log("response: text",text);
        let jsonstr = this.parseJSONAnswer(text);
        let ds = JSON.parse(jsonstr);
        console.log("ds",ds);
    }    
}

const args = process.argv.slice(2);
let input = Arguments.getString(args,"List all products","-input") as string;

const test = new TestClassify();
test.classify(input);


/*
test:
node dist/test/test.classify.js -input "List all courses training"
node dist/test/test.classify.js -input "List all employee leave quota"
node dist/test/test.classify.js -input "List all employee family services"

{
  "category_name": null,
  "category_feedback": "The question is not about product selling, course training, or employee leave.  It asks for a list of services offered to employees' families.  To answer, I would need access to the specific employee family services offered by a particular company or organization.  This information is not available to me."
}
  
*/