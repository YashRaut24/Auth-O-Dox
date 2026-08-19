import { createWorker } from "tesseract.js";

const worker = await createWorker("eng");

const result = await worker.recognize("./certificates/JavaCertificate.png");

console.log(result.data.text);

await worker.terminate();