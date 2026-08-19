import { createWorker } from "tesseract.js";

export async function recognizeCertificate(fileBuffer) {
    if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
        throw new Error("A non-empty certificate file is required for OCR");
    }

    const worker = await createWorker("eng");
    try {
        const result = await worker.recognize(fileBuffer);
        return { text: result.data.text.trim(), confidence: result.data.confidence };
    } finally {
        await worker.terminate();
    }
}
