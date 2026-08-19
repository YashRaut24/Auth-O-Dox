import fs from "fs";
import path from "path";

import { pdf } from "pdf-to-img";
import sharp from "sharp";
import jsQR from "jsqr";

import { createCanvas, loadImage } from "canvas";

async function decodeBuffer(buffer) {
  const image = await loadImage(buffer);

  const canvas = createCanvas(
    image.width,
    image.height
  );

  const context = canvas.getContext("2d");

  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height
  );

  const imageData =
    context.getImageData(
      0,
      0,
      image.width,
      image.height
    );

  const result = jsQR(
    imageData.data,
    imageData.width,
    imageData.height,
    {
      inversionAttempts:
        "attemptBoth"
    }
  );

  if (result?.data) {
    return result.data;
  }

  return null;
}

async function createImageVariants(buffer) {
  const variants = [];

  variants.push(buffer);

  try {
    const metadata =
      await sharp(buffer).metadata();

    const width =
      metadata.width || 0;

    if (width < 2400) {
      const enlarged =
        await sharp(buffer)
          .resize({
            width: 2400,
            withoutEnlargement: false
          })
          .png()
          .toBuffer();

      variants.push(enlarged);
    }

    const normalized =
      await sharp(buffer)
        .grayscale()
        .normalize()
        .png()
        .toBuffer();

    variants.push(normalized);

    const threshold =
      await sharp(buffer)
        .grayscale()
        .normalize()
        .threshold(180)
        .png()
        .toBuffer();

    variants.push(threshold);
  } catch (error) {
    console.error(
      "Image preprocessing error:",
      error.message
    );
  }

  return variants;
}

async function detectInBuffer(buffer) {
  const variants =
    await createImageVariants(buffer);

  for (const variant of variants) {
    try {
      const result =
        await decodeBuffer(variant);

      if (result) {
        return result;
      }
    } catch {
      // Continue with next image variant
    }
  }

  return null;
}

async function detectFromImage(filePath) {
  const buffer =
    fs.readFileSync(filePath);

  return await detectInBuffer(buffer);
}

async function detectFromPdf(filePath) {
  const document =
    await pdf(filePath, {
      scale: 4
    });

  let pageNumber = 0;

  try {
    for await (const image of document) {
      pageNumber++;

      console.log(
        `Scanning PDF page ${pageNumber} for QR...`
      );

      const result =
        await detectInBuffer(image);

      if (result) {
        console.log(
          `QR detected on page ${pageNumber}`
        );

        return result;
      }
    }

    return null;
  } finally {
    if (
      document &&
      typeof document.destroy ===
        "function"
    ) {
      await document.destroy();
    }
  }
}

export async function detectQRCode(
  filePath,
  mimeType
) {
  if (!filePath) {
    return {
      detected: false,
      data: null,
      reason: "No file provided"
    };
  }

  try {
    const extension =
      path.extname(filePath)
        .toLowerCase();

    const isPdf =
      mimeType ===
        "application/pdf" ||
      extension === ".pdf";

    const qrData = isPdf
      ? await detectFromPdf(filePath)
      : await detectFromImage(filePath);

    if (!qrData) {
      return {
        detected: false,
        data: null,
        reason:
          "No QR code found in the certificate"
      };
    }

    return {
      detected: true,
      data: qrData,
      reason: null
    };
  } catch (error) {
    console.error(
      "QR detection error:",
      error
    );

    return {
      detected: false,
      data: null,
      reason:
        "QR detection could not be completed"
    };
  }
}