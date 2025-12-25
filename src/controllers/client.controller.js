import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Client } from "../models/clientModel.js";

// @desc    Create a new client
// @route   POST /api/v1/clients
// @access  Private (Broker/Agent)
const createClient = asyncHandler(async (req, res) => {
    const { type, phone, region, zone, wereda, kebele } = req.body;

    if (!type || !phone || !region || !zone || !wereda || !kebele) {
        throw new ApiError(400, "Type, Phone, and full Address (Region-Kebele) are required");
    }

    //  Conditional Validation
    if (type === "Individual") {
        if (!req.body.firstName || !req.body.fatherName) {
            throw new ApiError(400, "First Name and Father Name are required for Individuals");
        }
    } else if (type === "Business") {
        if (!req.body.companyName || !req.body.tinNumber) {
            throw new ApiError(400, "Company Name and TIN Number are required for Businesses");
        }
    }

    const existingClient = await Client.findOne({
        $or: [
            { phone: phone },
            { tinNumber: req.body.tinNumber ? req.body.tinNumber : "non-existent-tin" }
        ],
        createdBy: req.user._id
    });

    if (existingClient) {
        throw new ApiError(409, "Client with this Phone or TIN already exists in your list");
    }

    const client = await Client.create({
        ...req.body,
        createdBy: req.user._id, // Assign the client to the logged-in user
    });

    return res
        .status(201)
        .json(new ApiResponse(201, client, "Client created successfully"));
});

// @desc    Get all clients (Search & Filter)
// @route   GET /api/v1/clients
// @access  Private
const getClients = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user._id, isActive: true };

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: "i" } }, // Case insensitive
            { fatherName: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { tinNumber: { $regex: search, $options: "i" } },
        ];
    }

    const clients = await Client.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Client.countDocuments(query);

    return res
        .status(200)
        .json(new ApiResponse(200, { clients, total, page, limit }, "Clients fetched successfully"));
});

// @desc    Get single client details
// @route   GET /api/v1/clients/:id
// @access  Private
const getClientById = asyncHandler(async (req, res) => {
    const client = await Client.findOne({
        _id: req.params.id,
        createdBy: req.user._id
    });

    if (!client) {
        throw new ApiError(404, "Client not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, client, "Client details fetched"));
});



// @desc    Update client details
// @route   PATCH /api/v1/clients/:id
// @access  Private
const updateClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Prevent critical field changes that might break data integrity
    if (updates.type) {
        delete updates.type;
    }

    const client = await Client.findOneAndUpdate(
        { _id: id, createdBy: req.user._id }, // Ensure ownership
        { $set: updates },
        { new: true, runValidators: true } // Return updated doc & run schema validation
    );

    if (!client) {
        throw new ApiError(404, "Client not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, client, "Client details updated successfully"));
});

// @desc    Soft delete client
// @route   DELETE /api/v1/clients/:id
// @access  Private
const deleteClient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // We do NOT use findOneAndDelete. We use Soft Delete.
    const client = await Client.findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        { $set: { isActive: false } },
        { new: true }
    );

    if (!client) {
        throw new ApiError(404, "Client not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Client deleted successfully (Archived)"));
});

export {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};