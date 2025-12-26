import mongoose, { Schema } from "mongoose";

const carrierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g., "Awash Insurance Company"
    },
    alias: {
      type: String,
      trim: true,
      uppercase: true, // e.g., "AWASH", "EIC"
    },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String },
      website: { type: String },
      address: { type: String },
    },
    contactPerson: {
      name: String,
      role: String,
      phone: String,
    },
    // We store commission defaults here to auto-fill policies later
    commissionDefaults: [
      {
        policyType: { type: String }, // "Medical"
        percentage: { type: Number, default: 0 }, // e.g., 10 (for 10%)
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Carrier = mongoose.model("Carrier", carrierSchema);
