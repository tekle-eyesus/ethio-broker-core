import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    policy: {
      type: Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    carrier: {
      type: Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },
    type: {
      type: String,
      enum: ["ClientPayment", "CarrierRemittance", "CommissionReceipt"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Cheque", "CPO", "Mobile Money"], // Telebirr/CBE Birr
      required: true,
    },
    referenceNumber: {
      type: String, // Cheque Number or Transaction ID
      trim: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Cleared", "Bounced"], // Important for Cheques
      default: "Cleared",
    },
    note: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
