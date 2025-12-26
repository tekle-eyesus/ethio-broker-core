import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Carrier } from "../models/carrierModel.js";

// @desc    Add a new Insurance Company
// @route   POST /api/v1/carriers
// @access  Private (Admin/Broker)
const createCarrier = asyncHandler(async (req, res) => {
  const { name, contactInfo } = req.body;

  if (!name || !contactInfo?.phone) {
    throw new ApiError(400, "Carrier Name and Phone are required");
  }

  const existingCarrier = await Carrier.findOne({ name });
  if (existingCarrier) {
    throw new ApiError(409, "Carrier already exists");
  }

  const carrier = await Carrier.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, carrier, "Insurance Carrier added successfully")
    );
});

// @desc    Get all active carriers
// @route   GET /api/v1/carriers
// @access  Private
const getCarriers = asyncHandler(async (req, res) => {
  const carriers = await Carrier.find({ isActive: true })
    .select("name alias contactInfo commissionDefaults") // Optimize payload
    .sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, carriers, "Carriers fetched successfully"));
});

// @desc    Update carrier
// @route   PATCH /api/v1/carriers/:id
// @access  Private
const updateCarrier = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const carrier = await Carrier.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  if (!carrier) {
    throw new ApiError(404, "Carrier not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, carrier, "Carrier updated successfully"));
});

// @desc    Soft Delete carrier
// @route   DELETE /api/v1/carriers/:id
// @access  Private
const deleteCarrier = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Carrier.findByIdAndUpdate(id, { isActive: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Carrier removed (archived)"));
});

export { createCarrier, getCarriers, updateCarrier, deleteCarrier };
