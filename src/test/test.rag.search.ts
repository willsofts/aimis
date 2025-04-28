import { RAG_API_KEY, RAG_API_URL, RAG_API_URL_SEARCH } from "../utils/EnvironmentVariable";
import { Arguments } from "@willsofts/will-util";
import axios from 'axios';

const args = process.argv.slice(2);
const id = Arguments.getString(args,"ea2af6a0_201f_11f0_beed_00090ffe0001","-id") as string;
const input = Arguments.getString(args,"เดือนพฤษภาคมมีวันหยุดกี่วัน","-input") as string;

async function searchText() {

    let url = RAG_API_URL + RAG_API_URL_SEARCH;
    let response = await axios.post(url, 
      {
        libraryId: id,
        searchText: input,
        limit: 10
      },
      {
        headers: {
          'x-api-key': RAG_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('sent successfully:', response.data);
    if(response.data?.body) {
      let chunks = response.data?.body?.contentChunks;
      if(chunks) {
        chunks.forEach((item:any,index:number) => {
          console.log(index+"."+item.content);
        });
      }
    }
}

searchText();

//node dist/test/test.rag.search.js -input เดือนพฤษภาคมมีวันหยุดกี่วัน

//node dist/test/test.rag.search.js -id a4122f79_4fd1_4ed4_a323_11ed5fa5e123

