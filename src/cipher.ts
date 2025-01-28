import { CipherUtility } from "@willsofts/will-util";
import { Arguments } from "@willsofts/will-util";

let args = process.argv.slice(2);
let texts = Arguments.getString(args,"Hello Cipher","-t","-txt") as string;
let enc = Arguments.getBoolean(args,true,"-e","-enc");
if(enc) {
    let res = CipherUtility.encrypt(texts);
    console.log("encrypt:",res);
} else {
    let res = CipherUtility.decrypt(texts);
    console.log("decrypt:",res);
}
