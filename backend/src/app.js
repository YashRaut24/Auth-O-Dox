import express from "express";
import cors from "cors";
import morgan from "morgan";

import { validateQRUrl } from "./services/qr/qrValidator.js";
import { fetchVerificationPage } from "./services/qr/webFetcher.js";
import { extractCertificateData } from "./services/qr/certificateExtractor.js";
import { detectQRCode } from "./services/qr/qrDetector.js";

import upload from "./middleware/upload.js";

import { extractOCR } from "./services/ocr/tesseract.js";
import { extractCertificateFields } from "./services/ocr/extractCertificateFields.js";

import { compareCertificateData } from "./services/verification/compareCertificate.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.post(
  "/api/verify",
  upload.single("certificate"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No certificate uploaded"
        });
      }

      console.log(
        "Uploaded file:",
        req.file.originalname
      );

      const ocrText = await extractOCR(
        req.file.path,
        req.file.mimetype
      );

      const certificateData =
        extractCertificateFields(
          ocrText
        );

      console.log(
        "Certificate fields:",
        certificateData
      );

      const qr =
        await detectQRCode(
          req.file.path,
          req.file.mimetype
        );

      console.log(
        "QR result:",
        qr
      );

      let qrValidation = null;
      let issuerData = null;
      let comparison = null;

      if (qr.detected) {
        qrValidation =
          validateQRUrl(qr.data);

        if (qrValidation.valid) {
          try {
            const page =
              await fetchVerificationPage(
                qr.data
              );

            issuerData =
              extractCertificateData(
                page.body,
                qr.data
              );

            comparison =
              compareCertificateData(
                certificateData,
                issuerData
              );
          } catch (error) {
            console.error(
              "Issuer verification error:",
              error.message
            );
          }
        }
      }

      let status = "UNVERIFIABLE";

      if (comparison) {
        status = comparison.status;
      }

      res.json({
        success: true,

        certificateData,

        ocr: {
          detected:
            Boolean(
              ocrText?.trim()
            )
        },

        qr: {
          detected: qr.detected,
          data: qr.data,
          validation: qrValidation
        },

        issuer: issuerData,

        verification: {
          status,
          comparison
        },

        processing: {
          completed: true
        },

        rawOCR: ocrText
      });
    } catch (error) {
      console.error(
        "Verification error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Certificate verification failed"
      });
    }
  }
);

app.post("/api/qr", async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    return res.status(400).json({
      success: false,
      message: "QR data is required"
    });
  }

  const validation =
    validateQRUrl(qrData);

  if (!validation.valid) {
    return res.status(400).json(
      validation
    );
  }

  try {
    const page =
      await fetchVerificationPage(
        qrData
      );

    const certificateData =
      extractCertificateData(
        page.body,
        qrData
      );

    res.json({
      success: true,
      validation,
      certificateData
    });
  } catch (error) {
    console.error(
      "Fetch error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to process verification URL"
    });
  }
});

export default app;