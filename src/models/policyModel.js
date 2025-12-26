import mongoose, { Schema } from "mongoose";

const policySchema = new Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g., "MTR/1234/2024"
    },
    // Link to Client (Who bought it)
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    // Link to Carrier (Who provides it)
    carrier: {
      type: Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Motor",
        "Health",
        "Property",
        "Marine",
        "Engineering",
        "Bond",
        "Travel",
        "Other",
      ],
      required: true,
    },
    // e.g., "Third Party", "Comprehensive", "Group Personal Accident"
    subCategory: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // Financials
    premiumAmount: {
      type: Number,
      required: true, // Total amount client pays
    },
    commissionRate: {
      type: Number,
      default: 0, // e.g., 10%
    },
    commissionAmount: {
      type: Number,
      default: 0, // Calculated: (premium * rate) / 100
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Cancelled", "Pending"],
      default: "Pending",
    },
    // Document Storage
    documents: [
      {
        docType: String, // "Policy Schedule", "Yellow Card"
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Middleware to calculate commission before saving
policySchema.pre("save", function (next) {
  if (this.premiumAmount && this.commissionRate) {
    this.commissionAmount = (this.premiumAmount * this.commissionRate) / 100;
  }

  // Auto-update status based on dates
  const now = new Date();
  if (this.endDate < now) {
    this.status = "Expired";
  } else if (this.startDate > now) {
    this.status = "Pending";
  } else {
    this.status = "Active";
  }

  next();
});

export const Policy = mongoose.model("Policy", policySchema);
