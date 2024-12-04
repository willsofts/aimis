import fs from 'fs';
import axios from 'axios';
import { Arguments } from "@willsofts/will-util";

interface ImageStream { name: string, stream: string }

let image_files = [
"cat.jpg","dog.jpg","dolphin.jpg","elephant.jpg","kangaroo.jpg","koala.jpg","lion.jpg","monkey.jpg","panda.jpg","parrot.jpg","tiger.jpg","zebra.jpg"
];

let args = process.argv.slice(2);
let url = Arguments.getString(args,'http://localhost:8080/api/chatimage/ask','-url');
let mime = Arguments.getString(args,'image/jpeg','-mime');
let category = Arguments.getString(args,'MY-KEY','-cat','-key');
let query = Arguments.getString(args,'Can you tell me about the animal of this image','-qry','-quest');
if(url && mime && category && query) {
    let image_streams : ImageStream[] = [];
    let path = "./images/animals/";
    image_files.forEach(name => {
        let file = path+name;
        let existing = fs.existsSync(file);
        if(existing) {
            let buffer = fs.readFileSync(file, {flag:'r'});
            let stream = buffer.toString("base64");
            if(stream) image_streams.push({name:name,stream:stream});
        }
    
    });
    if(image_streams.length > 0) {
        image_streams.forEach(img => {
            askImage(url,category,query,mime,img.name,img.stream);
        });
    }
}
function askImage(url:string, key: string, query:string, mime:string, name: string, image:string) {
    let config = { 
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let data = {
        category: key,
        query: query,
        mime: mime,
        image: image
    };
    axios.post(url, data, config).then((res: any) => {
        console.log("response of",name,"data",JSON.stringify(res.data));
    }).catch(function (error: any) {
        console.log(error);
    });
}
