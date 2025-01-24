import { VisionHandler } from "../question/VisionHandler";
import { Arguments } from "@willsofts/will-util";

const args = process.argv.slice(2);
const input = Arguments.getString(args,"Extract text from image.","-input") as string;
const mime = Arguments.getString(args,"image/png","-mime") as string;
const imgfile = Arguments.getString(args,"MyImage.png","-img") as string;
const prop = Arguments.getString(args,"","-prop") as string;
const handler = new VisionHandler();
const image = handler.getImageData(imgfile);
handler.processQuestion({async:"", questionid: "", question: input, mime: mime, image: image, correlation: "12345", category: "TEST", property: prop}).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});
