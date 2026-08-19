import express from "express";

import cors from "cors";
import morgan from "morgan";
import { validateQRUrl } from "./services/qr/qrValidator.js";
import { fetchVerificationPage } from "./services/qr/webFetcher.js";
import { extractCertificateData } from "./services/qr/certificateExtractor.js";
import upload from "./middleware/upload.js";
import { extractOCR } from "./services/ocr/tesseract.js";

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan("dev"));
app.use(cors());

app.post(
  "/api/verify",
  upload.single("certificate"),
  async (req, res) => {
    try {
      console.log("Uploaded file:", req.file);

      const ocrText = await extractOCR(
        req.file.path,
        req.file.mimetype
      );

      console.log("OCR TEXT:");
      console.log(ocrText);

      res.json({
        success: true,
        ocrText
      });
    } catch (error) {
      console.error("OCR error:", error);

      res.status(500).json({
        success: false,
        message: "OCR processing failed"
      });
    }
  }
);

app.post("/api/qr", async (req, res) => {
  const { qrData } = req.body;

  const validation = validateQRUrl(qrData);

  if (!validation.valid) {
    return res.status(400).json(validation);
  }

  try {
    const page = await fetchVerificationPage(qrData);

    const certificateData = extractCertificateData(
      page.body,
      qrData
    );

    res.json({
      success: true,
      validation,
      certificateData
    });
  } catch (error) {
    console.error("Fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to process verification URL"
    });
  }
});

export default app;