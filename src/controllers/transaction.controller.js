import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transactionModel.js";
import { Policy } from "../models/policyModel.js";

// @desc    Record a Payment (In or Out)
// @route   POST /api/v1/finance/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const {
    policyId,
    type,
    amount,
    paymentMethod,
    referenceNumber,
    transactionDate,
  } = req.body;

  // Policy to get links
  const policy = await Policy.findById(policyId);
  if (!policy) throw new ApiError(404, "Policy not found");

  const transaction = await Transaction.create({
    policy: policyId,
    client: policy.client,
    carrier: policy.carrier,
    type,
    amount,
    paymentMethod,
    referenceNumber,
    transactionDate: transactionDate || Date.now(),
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, transaction, "Transaction recorded successfully")
    );
});

// @desc    Get Statement for a Policy
// @route   GET /api/v1/finance/policy/:policyId
// @access  Private
const getPolicyStatement = asyncHandler(async (req, res) => {
  const { policyId } = req.params;

  // policy Details
  const policy = await Policy.findById(policyId).select(
    "premiumAmount commissionAmount"
  );
  if (!policy) throw new ApiError(404, "Policy not found");

  // transactions
  const transactions = await Transaction.find({ policy: policyId }).sort({
    transactionDate: 1,
  });

  // calculate totals
  let totalPaidByClient = 0;
  let totalRemittedToCarrier = 0;

  transactions.forEach((tx) => {
    if (tx.type === "ClientPayment" && tx.status === "Cleared") {
      totalPaidByClient += tx.amount;
    } else if (tx.type === "CarrierRemittance" && tx.status === "Cleared") {
      totalRemittedToCarrier += tx.amount;
    }
  });

  //  balances
  const clientBalance = policy.premiumAmount - totalPaidByClient;
  // Carrier balance: We usually owe them (Premium - Commission) or Full Premium depending on agreement
  // For MVP, assume we owe full premium minus what we sent
  const carrierBalance = policy.premiumAmount - totalRemittedToCarrier;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        policyTotals: {
          premium: policy.premiumAmount,
          commission: policy.commissionAmount,
        },
        summary: {
          totalPaidByClient,
          clientBalance, // If > 0, Client owes money
          totalRemittedToCarrier,
          carrierBalance,
        },
        transactions,
      },
      "Statement generated"
    )
  );
});

// @desc    Get Daily/Monthly Financial Report
// @route   GET /api/v1/finance/report
// @access  Admin/Broker
const getFinancialReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {};
  if (startDate && endDate) {
    query.transactionDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const transactions = await Transaction.find(query)
    .populate("client", "firstName companyName")
    .sort({ transactionDate: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Financial report generated"));
});

export { createTransaction, getPolicyStatement, getFinancialReport };
