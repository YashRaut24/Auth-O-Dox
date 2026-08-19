import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Issuer from "../models/Issuer.js";
import config from "../config/config.js";

const email = (process.env.ISSUER_EMAIL || "issuer@authodox.demo").trim().toLowerCase();
const password = process.env.ISSUER_PASSWORD || "Demo@12345";

try {
    await mongoose.connect(config.MONGO_URI);

    const existingIssuer = await Issuer.findOne({ email });
    if (existingIssuer) {
        console.log(`Issuer already exists: ${email}`);
        process.exitCode = 0;
    } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        await Issuer.create({
            institutionName: "K C College of Engineering and Management Studies and Research",
            issuerName: "Authorized Certificate Officer",
            email,
            password: hashedPassword,
            role: "issuer",
            isActive: true
        });
        console.log(`Demo issuer created: ${email}`);
    }
} catch (error) {
    console.error("Unable to seed issuer:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
