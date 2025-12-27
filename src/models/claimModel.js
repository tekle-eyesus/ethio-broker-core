import mongoose, { Schema } from "mongoose";

const claimSchema = new Schema(
  {
    claimNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true, // The Broker's internal reference or Carrier's Claim #
    },
    policy: {
      type: Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },
    // Client Details denormalized for quick access
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    dateOfIncident: {
      type: Date,
      required: true,
    },
    dateReported: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true, // Description of the incident
    },
    status: {
      type: String,
      enum: ["Reported", "In Review", "Approved", "Paid", "Rejected", "Closed"],
      default: "Reported",
    },
    // Financials
    claimedAmount: {
      type: Number,
      default: 0, // What the client asks for
    },
    approvedAmount: {
      type: Number,
      default: 0, // What the insurer agrees to pay
    },
    // Documents (Police Report, Photos, Estimates)
    documents: [
      {
        docType: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String, // Internal broker notes
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Claim = mongoose.model("Claim", claimSchema);
