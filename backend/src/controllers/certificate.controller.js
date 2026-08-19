import crypto from "crypto";

import Certificate
    from "../models/certificate.model.js";

import {
    registerCertificate
} from "../services/blockchain.service.js";

export async function issueCertificate(
    req,
    res
) {
    try {

        const { certificateId, studentName } =
            req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Certificate PDF required"
            });
        }

        // 1. Generate SHA-256
        const certificateHash =
            crypto
                .createHash("sha256")
                .update(req.file.buffer)
                .digest("hex");

        // 2. Store hash on blockchain
        const blockchainResult =
            await registerCertificate(
                certificateHash
            );

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
                issuerAddress:
                    process.env.ISSUER_ADDRESS
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