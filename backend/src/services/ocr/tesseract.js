import { createWorker } from "tesseract.js";
import { pdf } from "pdf-to-img";
import fs from "fs/promises";
import path from "path";

export async function extractOCR(filePath, mimeType) {
  const worker = await createWorker("eng");

  try {
    if (mimeType === "application/pdf") {
      const document = await pdf(filePath, { scale: 2 });

      let fullText = "";

      for await (const image of document) {
        const tempImagePath = path.join(
          "uploads",
          `ocr-page-${Date.now()}.png`
        );

        await fs.writeFile(tempImagePath, image);

        const result = await worker.recognize(tempImagePath);

        fullText += result.data.text + "\n";

        await fs.unlink(tempImagePath);
      }

      return fullText.trim();
    }

    const result = await worker.recognize(filePath);

    return result.data.text;
  } finally {
    await worker.terminate();
  }
}
export async function recognizeCertificate(fileBuffer) {
    if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
        throw new Error("A non-empty certificate file is required for OCR");
    }

    const worker = await createWorker("eng");
    try {
    const isPdf = fileBuffer.subarray(0, 5).toString() === "%PDF-";

    if (!isPdf) {
      const result = await worker.recognize(fileBuffer);
      return { text: result.data.text.trim(), confidence: result.data.confidence };
    }

    const document = await pdf(
      `data:application/pdf;base64,${fileBuffer.toString("base64")}`,
      { scale: 2 }
    );
    const pageTexts = [];
    const pageConfidences = [];

    try {
      for await (const pageImage of document) {
        const result = await worker.recognize(pageImage);
        pageTexts.push(result.data.text);
        pageConfidences.push(result.data.confidence);
      }
    } finally {
      document.destroy();
    }

    const confidence = pageConfidences.length
      ? pageConfidences.reduce((total, value) => total + value, 0) / pageConfidences.length
      : 0;

    return {
      text: pageTexts.join("\n").trim(),
      confidence
    };
    } finally {
        await worker.terminate();
    }
}
