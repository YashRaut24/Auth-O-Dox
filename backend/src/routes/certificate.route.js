import express from "express";
import multer from "multer";

import {
    issueCertificate,
    verifyCertificate
} from "../controllers/certificate.controller.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/issue",
    upload.single("certificate"),
    issueCertificate
);

router.post(
    "/verify",
    upload.single("certificate"),
    verifyCertificate
);

export default router;
