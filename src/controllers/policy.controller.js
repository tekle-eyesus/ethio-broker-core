import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Policy } from "../models/policyModel.js";
import { Client } from "../models/clientModel.js";

// @desc    Create a new Policy
// @route   POST /api/v1/policies
// @access  Private
const createPolicy = asyncHandler(async (req, res) => {
  const {
    policyNumber,
    clientId,
    carrierId,
    category,
    startDate,
    endDate,
    premiumAmount,
  } = req.body;

  const client = await Client.findById(clientId);
  if (!client) throw new ApiError(404, "Client not found");

  // Duplicate Policy Number
  const existingPolicy = await Policy.findOne({ policyNumber });
  if (existingPolicy) throw new ApiError(409, "Policy Number already exists");

  const policy = await Policy.create({
    ...req.body,
    client: clientId,
    carrier: carrierId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, policy, "Policy created successfully"));
});

// @desc    Get All Policies (with Filters)
// @route   GET /api/v1/policies
// @access  Private
const getPolicies = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    clientId,
    expiringSoon,
  } = req.query;

  const query = {};

  // Filters
  if (status) query.status = status;
  if (category) query.category = category;
  if (clientId) query.client = clientId;

  // "Expiring Soon" Logic (Expiring in next 30 days)
  if (expiringSoon === "true") {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    query.endDate = {
      $gte: today,
      $lte: nextMonth,
    };
    query.status = "Active"; // Only count active ones
  }

  const policies = await Policy.find(query)
    .populate("client", "firstName fatherName companyName phone") // Show client names
    .populate("carrier", "name alias") // Show carrier names
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Policy.countDocuments(query);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { policies, total, page, limit },
        "Policies fetched successfully"
      )
    );
});

// @desc    Get Single Policy Detail
// @route   GET /api/v1/policies/:id
// @access  Private
const getPolicyById = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id)
    .populate("client")
    .populate("carrier");

  if (!policy) throw new ApiError(404, "Policy not found");

  return res
    .status(200)
    .json(new ApiResponse(200, policy, "Policy details fetched"));
});

// @desc    Upload Policy Document
// @route   POST /api/v1/policies/:id/documents
// @access  Private
const uploadPolicyDocument = asyncHandler(async (req, res) => {
  // same as client upload
  const { id } = req.params;
  const { docType } = req.body;

  if (!req.file) throw new ApiError(400, "No file uploaded");

  const fileUrl = `/temp/${req.file.filename}`;

  const policy = await Policy.findByIdAndUpdate(
    id,
    {
      $push: {
        documents: {
          docType: docType || "Policy Document",
          url: fileUrl,
          originalName: req.file.originalname,
        },
      },
    },
    { new: true }
  );

  if (!policy) throw new ApiError(404, "Policy not found");

  return res
    .status(200)
    .json(new ApiResponse(200, policy, "Policy document uploaded"));
});

export { createPolicy, getPolicies, getPolicyById, uploadPolicyDocument };
