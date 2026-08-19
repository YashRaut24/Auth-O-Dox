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