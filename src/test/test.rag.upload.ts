import { RAG_API_KEY, RAG_API_URL, RAG_API_URL_UPLOAD } from "../utils/EnvironmentVariable";
import { Arguments } from "@willsofts/will-util";
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

const args = process.argv.slice(2);
const filepath = Arguments.getString(args,"./pdf/Holiday_2568_GROUP.pdf","-file") as string;
const id = Arguments.getString(args,"ea2af6a0_201f_11f0_beed_00090ffe0001","-id") as string;

async function uploadFile() {
    const filestream = fs.createReadStream(filepath);
    const form = new FormData();
    form.append("library_id",id);
    form.append('files', filestream);

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

//node dist/test/test.rag.upload.js
