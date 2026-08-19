import crypto from "crypto";

import Certificate
    from "../models/certificate.model.js";

import {
    registerCertificate,
    verifyCertificateOnChain
} from "../services/blockchain.service.js";
import { recognizeCertificate } from "../services/ocr/tesseract.js";

function normalize(value) {
    return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function getOcrConfidenceThreshold() {
    const threshold = Number(process.env.OCR_CONFIDENCE_THRESHOLD ?? 70);
    return Number.isFinite(threshold) ? threshold : 70;
}

export async function issueCertificate(
    req,
    res
) {
    try {

        const { certificateId, studentName, imageUrl } = req.body;

        if (!req.file || !certificateId?.trim() || !studentName?.trim()) {
            return res.status(400).json({
                message: "certificate, certificateId, and studentName are required"
            });
        }

        const existing = await Certificate.findOne({ certificateId: certificateId.trim() });
        if (existing) return res.status(409).json({ message: "Certificate ID already registered" });

        const ocr = await recognizeCertificate(req.file.buffer);
        // const confidenceThreshold = getOcrConfidenceThreshold();
        const confidenceThreshold = 60;
        if (ocr.confidence <= confidenceThreshold) {
            return res.status(422).json({
                message: `OCR confidence must be greater than ${confidenceThreshold}% before registering a certificate`,
                ocrConfidence: ocr.confidence,
                requiredConfidence: confidenceThreshold
            });
        }

        const ocrText = normalize(ocr.text);
        console.log(ocrText);
        console.log(!ocrText.includes(normalize(certificateId)));
        console.log(!ocrText.includes(normalize(studentName)));
        
        if (!ocrText ) {
            return res.status(422).json({
                message: "OCR text does not match the supplied certificate ID and student name",
                ocrConfidence: ocr.confidence
            });
        }

        // 1. Generate SHA-256
        const certificateHash =
            crypto
                .createHash("sha256")
                .update(req.file.buffer)
                .digest("hex");

        const duplicateHash = await Certificate.findOne({ certificateHash });
        if (duplicateHash) {
            return res.status(409).json({ message: "This certificate file is already registered" });
        }

        // 2. Store hash on blockchain
        const blockchainResult =
            await registerCertificate(
                certificateHash
            );

        const chainVerification = await verifyCertificateOnChain(certificateHash);
        if (!chainVerification.exists) throw new Error("Certificate could not be verified after blockchain registration");

        // 3. Store application data in MongoDB
        const certificate =
            await Certificate.create({
                certificateId,
                studentName,
                certificateHash,
                transactionHash:
                    blockchainResult.transactionHash,
                contractAddress:
                    process.env.CONTRACT_ADDRESS,
                imageUrl: imageUrl?.trim() || undefined,
                issuerAddress: chainVerification.issuer,
                ocrText: ocr.text,
                ocrConfidence: ocr.confidence,
                blockchainVerified: true
            });

        return res.status(201).json({
            message:
                "Certificate registered successfully",

            certificate
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:
                "Certificate registration failed"
        });
    }
}

export async function verifyCertificate(req, res) {
    try {
        if (!req.file) return res.status(400).json({ message: "Certificate file required" });

        const certificateHash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
        const [certificate, blockchain] = await Promise.all([
            Certificate.findOne({ certificateHash }),
            verifyCertificateOnChain(certificateHash)
        ]);
        const valid = Boolean(certificate && blockchain.exists &&
            certificate.issuerAddress.toLowerCase() === blockchain.issuer.toLowerCase());

        return res.status(valid ? 200 : 404).json({
            valid,
            certificate: valid ? certificate : null,
            blockchain: { exists: blockchain.exists, issuer: blockchain.issuer, timestamp: blockchain.timestamp }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Certificate verification failed" });
    }
}

export async function listIssuedCertificates(req, res) {
    try {
        const certificates = await Certificate.find({})
            .select("certificateId studentName blockchainVerified createdAt transactionHash")
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            certificates
        });
    } catch (error) {
        console.error("Issued certificates error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to load issued certificates"
        });
    }
}
