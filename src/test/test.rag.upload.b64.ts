import { RAG_API_KEY, RAG_API_URL, RAG_API_URL_UPLOAD } from "../utils/EnvironmentVariable";
import { Arguments } from "@willsofts/will-util";
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

const args = process.argv.slice(2);
const filepath = Arguments.getString(args,"./pdf/holiday_sec.pdf","-file") as string;
const id = Arguments.getString(args,"a4122f79_4fd1_4ed4_a323_11ed5fa5e123","-id") as string;

async function uploadFile() {
    let databuf = fs.readFileSync(filepath, {flag:'r'});
    let base64 = databuf.toString("base64");

    const buffer = Buffer.from(base64, 'base64');
    const form = new FormData();
    form.append("library_id",id);
    form.append('files', buffer, {filename: "holiday_sec.pdf", contentType: "application/pdf"});

    let url = RAG_API_URL + RAG_API_URL_UPLOAD;
    const response = await axios.post(url, form, {
      headers: {
        'x-api-key': RAG_API_KEY,
        ...form.getHeaders(),
      },
    });    
    console.log('sent successfully:', response.data);
}

uploadFile();

//node dist/test/test.rag.upload.b64.js
