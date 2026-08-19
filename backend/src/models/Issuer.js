import mongoose from "mongoose";

const issuerSchema = new mongoose.Schema(
    {
        institutionName: {
            type: String,
            required: true,
            trim: true
        },
        issuerName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ["issuer"],
            default: "issuer"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Issuer", issuerSchema);
