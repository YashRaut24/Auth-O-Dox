import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        certificateId: {
            type: String,
            required: true,
            unique: true
        },

        studentName: {
            type: String,
            required: true
        },

        certificateHash: {
            type: String,
            required: true,
            unique: true
        },

        transactionHash: {
            type: String,
            required: true
        },

        contractAddress: {
            type: String,
            required: true
        },

        imageUrl: {
            type: String,
            trim: true
        },

        issuerAddress: {
            type: String,
            required: true
        },

        ocrText: {
            type: String,
            required: true
        },

        ocrConfidence: {
            type: Number,
            required: true
        },

        blockchainVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Certificate",
    certificateSchema
);
