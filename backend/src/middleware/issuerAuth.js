import jwt from "jsonwebtoken";
import config from "../config/config.js";
import Issuer from "../models/Issuer.js";

export default async function issuerAuth(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    const token = authorization.slice(7).trim();

    try {
        const payload = jwt.verify(token, config.jwt_secret);

        if (payload.role !== "issuer") {
            return res.status(403).json({
                success: false,
                message: "Issuer access required"
            });
        }

        const issuer = await Issuer.findById(payload.issuerId);
        if (!issuer || !issuer.isActive) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        req.issuer = issuer;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }
}
