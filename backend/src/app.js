import express from "express";

import cors from "cors";
import morgan from "morgan";
import { validateQRUrl } from "./services/qr/qrValidator.js";
import { fetchVerificationPage } from "./services/qr/webFetcher.js";

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan("dev"));
app.use(cors());

app.post("/api/qr", async (req, res) => {
  const { qrData } = req.body;

  const validation = validateQRUrl(qrData);

  if (!validation.valid) {
    return res.status(400).json(validation);
  }

  try {
    const page = await fetchVerificationPage(qrData);

    console.log("Status:", page.status);
    console.log("Content Type:", page.contentType);
    console.log("Final URL:", page.url);
    console.log("HTML preview:", page.body.slice(0, 3000));
console.log("Contains certificate:", page.body.toLowerCase().includes("certificate"));
console.log("Contains student:", page.body.toLowerCase().includes("student"));
console.log("Contains course:", page.body.toLowerCase().includes("course"));
console.log("Contains certificate ID:", page.body.includes("9ab92ac2"));

    res.json({
      success: true,
      status: page.status,
      contentType: page.contentType,
      url: page.url,
      bodyLength: page.body.length
    });
  } catch (error) {
    console.error("Fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch verification URL"
    });
  }
});

export default app;