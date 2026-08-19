import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Issuer from "../models/Issuer.js";
import config from "../config/config.js";

function issuerResponse(issuer) {
    return {
        id: issuer._id,
        institutionName: issuer.institutionName,
        issuerName: issuer.issuerName,
        email: issuer.email,
        role: issuer.role
    };
}

export async function loginIssuer(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "Invalid issuer credentials"
        });
    }

    try {
        const issuer = await Issuer.findOne({ email: email.trim().toLowerCase() }).select("+password");
        const validPassword = issuer && await bcrypt.compare(password, issuer.password);

        if (!issuer || !validPassword || !issuer.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid issuer credentials"
            });
        }

        const token = jwt.sign(
            { issuerId: issuer._id.toString(), role: issuer.role },
            config.jwt_secret,
            { expiresIn: "8h" }
        );

        return res.json({
            success: true,
            token,
            issuer: issuerResponse(issuer)
        });
    } catch (error) {
        console.error("Issuer login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Issuer login failed"
        });
    }
}
