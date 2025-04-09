import fs from 'fs';
import path from 'path';
import { PDFReader } from "../detect/PDFReader";

export class QuestionUtility {

    public static hasIntensiveQuery(query: string | undefined) : boolean {
        if(!query || query.trim().length==0) return false;
        let q = query.toLowerCase();
        return q.indexOf("insert") >= 0 || q.indexOf("update") >= 0 || q.indexOf("delete") >= 0 || q.indexOf("drop") >= 0 || q.indexOf("alter") >= 0 || q.indexOf("execute") >= 0 || q.indexOf("exec") >= 0 || q.indexOf("truncate") >= 0;
    }

    public static parseAnswer(answer: string, defaultAnswer: boolean = true) : string {
        if(!answer) return answer;
        answer = answer.trim();
        let ans = answer;
        let idx = answer.indexOf("Answer:");
        if(idx >= 0) {
            ans = answer.substring(idx+7);
            ans = ans.trim();
        }
        let hasQuote = ans.startsWith("\"");
        if(hasQuote) {
            ans = ans.substring(1,ans.length-1);
        }
        if(hasQuote && ans.endsWith("\"")) {
            ans = ans.substring(0,ans.length-1);
        }
        let foundsql = false;
        idx = ans.indexOf("```sql");
        if(idx>=0) {
            foundsql = true;
            ans = ans.substring(idx+6);
        }
        let foundjson = false;
        idx = ans.indexOf("```json");
        if(idx>=0) {
            foundjson = true;
            ans = ans.substring(idx+7);
        }
        idx = ans.indexOf("```");
        if((!foundsql && !foundjson) && idx>=0) {
            ans = ans.substring(idx+3);
        }
        idx = ans.lastIndexOf("```");
        if(idx>0) {
            ans = ans.substring(0,idx);
        }
        let hasGrave = ans.startsWith("`");
        if(hasGrave) {
            ans = ans.substring(1,ans.length-1);
        }
        if(hasGrave && ans.endsWith("`")) {
            ans = ans.substring(0,ans.length-1);
        }
        let result = this.trime(ans.trim());
        if(result.startsWith('"')) {
            result = result.substring(1,result.length-1);
        }
        if(result.endsWith('"')) {
            result = result.substring(0,result.length-1);
        }
        if(foundjson) {
            try { 
                let json = JSON.parse(result); 
                if(json) {
                    let keys = Object.keys(json);
                    if(keys.length>0) return json[keys[0]];
                }
            } catch(e) { }
        }
        return result;
    }

    public static readDatabaseFileInfo(schemafile: string = "aidb_schema.sql", dbDir: string = "database", curDir?: string) : string {
        try {
            if(!curDir) curDir = process.cwd();
            let filepath = path.join(curDir,dbDir)
            let filename = path.resolve(filepath,schemafile);
            let filedata = fs.readFileSync(filename,'utf-8');
            return filedata;
        } catch(ex) {
            console.error(ex);
        }
        return "";
    }
    
    public static getDatabaseSchemaFile(category: string | undefined, dbDir: string = "database", curDir?: string) : string {
        if(category && category.trim().length > 0) {
            if(!curDir) curDir = process.cwd();
            let filename = category.toLowerCase()+"_schema.sql";
            let fullfilename = path.join(curDir,dbDir,filename);
            if(fs.existsSync(fullfilename)) {
                return filename;
            }
        }
        return "aidb_schema.sql";
    }

    public static getImageData(filename: string, imageDir: string = "images", curDir?: string) : string {
        if(!curDir) curDir = process.cwd();
        let filepath = path.join(curDir,imageDir,filename);
        console.log("getImageData: ",filepath);
        if(fs.existsSync(filepath)) {
            return Buffer.from(fs.readFileSync(filepath)).toString("base64");
        }
        return "";
    }

    public static readDucumentFile(filePath: string) : Promise<any> {
        let filename = filePath.toLowerCase();
        if(filename.endsWith(".txt") || filename.endsWith(".text") || filename.endsWith(".csv")) {
            const data = fs.readFileSync(filePath, 'utf8');
            return Promise.resolve({ text: data });
        }
        if(filename.endsWith(".pdf")) {
            let detector = new PDFReader();
            return detector.detectText(filePath);
        }
        return Promise.resolve({ text: "" });
    }

    public static trime(text: string) : string {
        return text.replaceAll("\\n","\n");
    }

    public static parseJSONAnswer(answer: string) : string {
        if(!answer) return answer;
        answer = answer.trim();
        let ans = answer;
        let hasQuote = ans.startsWith("\"");
        if(hasQuote) {
            ans = ans.substring(1,ans.length-1);
        }
        if(hasQuote && ans.endsWith("\"")) {
            ans = ans.substring(0,ans.length-1);
        }
        let foundjson = false;
        let idx = ans.indexOf("```json");
        if(idx>=0) {
            foundjson = true;
            ans = ans.substring(idx+7);
        }
        idx = ans.indexOf("```");
        if(!foundjson && idx>=0) {
            ans = ans.substring(idx+3);
        }
        idx = ans.lastIndexOf("```");
        if(idx>0) {
            ans = ans.substring(0,idx);
        }
        let hasGrave = ans.startsWith("`");
        if(hasGrave) {
            ans = ans.substring(1,ans.length-1);
        }
        if(hasGrave && ans.endsWith("`")) {
            ans = ans.substring(0,ans.length-1);
        }
        return this.trime(ans.trim());
    }

}