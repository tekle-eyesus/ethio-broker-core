import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Claim } from "../models/claim.model.js";
import { Policy } from "../models/policy.model.js";

// @desc    Register a new Claim
// @route   POST /api/v1/claims
// @access  Private
const createClaim = asyncHandler(async (req, res) => {
  const { claimNumber, policyId, dateOfIncident, description, claimedAmount } =
    req.body;

  // Verify Policy Exists
  const policy = await Policy.findById(policyId);
  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  // debulicate Claim Number
  const existingClaim = await Claim.findOne({ claimNumber });
  if (existingClaim) {
    throw new ApiError(409, "Claim number already exists");
  }

  const claim = await Claim.create({
    claimNumber,
    policy: policyId,
    client: policy.client, // Link directly for easier access
    dateOfIncident,
    description,
    claimedAmount,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, claim, "Claim registered successfully"));
});

// @desc    Get Claims (Filter by Status, Client, Policy)
// @route   GET /api/v1/claims
// @access  Private
const getClaims = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    clientId,
    policyId,
    search,
  } = req.query;
  const query = { isActive: true };

  if (status) query.status = status;
  if (clientId) query.client = clientId;
  if (policyId) query.policy = policyId;

  if (search) {
    query.$or = [
      { claimNumber: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const claims = await Claim.find(query)
    .populate("policy", "policyNumber category carrier") // Show policy # and type
    .populate("client", "firstName companyName phone") // Show who is claiming
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Claim.countDocuments(query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { claims, total, page, limit }, "Claims fetched")
    );
});

// @desc    Get Single Claim
// @route   GET /api/v1/claims/:id
// @access  Private
const getClaimById = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate({
      path: "policy",
      populate: { path: "carrier", select: "name contactInfo" }, // Deep populate Carrier info
    })
    .populate("client");

  if (!claim) throw new ApiError(404, "Claim not found");

  return res
    .status(200)
    .json(new ApiResponse(200, claim, "Claim details fetched"));
});

// @desc    Update Claim (Status, Amounts, Notes)
// @route   PATCH /api/v1/claims/:id
// @access  Private
const updateClaim = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const claim = await Claim.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!claim) throw new ApiError(404, "Claim not found");

  return res
    .status(200)
    .json(new ApiResponse(200, claim, "Claim updated successfully"));
});

// @desc    Upload Claim Document (Police Report, etc)
// @route   POST /api/v1/claims/:id/documents
// @access  Private
const uploadClaimDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { docType } = req.body;

  if (!req.file) throw new ApiError(400, "No file uploaded");

  const fileUrl = `/temp/${req.file.filename}`;

  const claim = await Claim.findByIdAndUpdate(
    id,
    {
      $push: {
        documents: {
          docType: docType || "Evidence",
          url: fileUrl,
          originalName: req.file.originalname,
        },
      },
    },
    { new: true }
  );

  if (!claim) throw new ApiError(404, "Claim not found");

  return res
    .status(200)
    .json(new ApiResponse(200, claim, "Claim document uploaded"));
});

export {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  uploadClaimDocument,
};
