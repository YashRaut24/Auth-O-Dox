import express from "express";
import multer from "multer";

import {
    issueCertificate,
    verifyCertificate
} from "../controllers/certificate.controller.js";
import { listIssuedCertificates } from "../controllers/certificate.controller.js";
import issuerAuth from "../middleware/issuerAuth.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/issue",
    issuerAuth,
    upload.single("certificate"),
    issueCertificate
);

router.get(
    "/issued",
    issuerAuth,
    listIssuedCertificates
);

router.post(
    "/verify",
    upload.single("certificate"),
    verifyCertificate
);

export default router;
