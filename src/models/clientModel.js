import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Individual", "Business"],
            required: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            index: true, // for faster search
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        region: {
            type: String,
            required: true,
        },
        zone: {
            type: String,
            required: true,
        },
        wereda: {
            type: String,
            required: true,
        },
        kebele: {
            type: String,
            required: true,
        },
        houseNumber: {
            type: String,
            default: "New",
        },

        // --- Individual Specific ---
        firstName: {
            type: String,
            trim: true,
        },
        fatherName: {
            type: String,
            trim: true,
        },
        grandfatherName: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
        },
        nationalId: {
            type: String, // Kebele ID or National ID
        },
        occupation: {
            type: String,
        },

        // --- Business Specific ---
        companyName: {
            type: String,
            trim: true,
        },
        businessType: {
            type: String, // e.g., PLC, Share Company, Sole Proprietorship
        },
        tinNumber: {
            type: String,
            trim: true,
        },
        tradeLicenseNumber: {
            type: String,
        },
        contactPerson: {
            type: String, // Name of the person representing the company
        },

        // --- System Fields ---
        documents: [
            {
                docType: String, // e.g., "ID Card", "Trade License"
                url: String,
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Client = mongoose.model("Client", clientSchema);