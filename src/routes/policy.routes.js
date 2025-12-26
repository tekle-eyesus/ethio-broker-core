import { Router } from "express";
import {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  uploadPolicyDocument,
} from "../controllers/policy.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPolicy).get(getPolicies);
router
  .route("/:id")
  .get(getPolicyById)
  .patch(updatePolicy)
  .delete(deletePolicy); // Soft delete

router
  .route("/:id/documents")
  .post(upload.single("document"), uploadPolicyDocument);

export default router;
