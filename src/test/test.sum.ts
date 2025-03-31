import { SumDocHandler } from "../sumdoc/SumDocHandler";

const args = process.argv.slice(2);
let sumid = "d60dc0a7-3595-49e3-8228-b6229fe0179b";
if(args.length>0) sumid = args[0];
const handler = new SumDocHandler();
handler.summary({params: { summaryid: sumid}, meta: {}}).then((result) => {
    console.log("Result:",result);
}).catch((err) => {
    console.error("Error:",err);
});

//node dist/test/test.sum.js d60dc0a7-3595-49e3-8228-b6229fe0179b 
