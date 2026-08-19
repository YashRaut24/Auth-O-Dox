import express from "express";
import { loginIssuer } from "../controllers/issuerAuthController.js";

const router = express.Router();

router.post("/login", loginIssuer);

export default router;
