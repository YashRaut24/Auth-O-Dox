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

        issuerAddress: {
            type: String,
            required: true
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