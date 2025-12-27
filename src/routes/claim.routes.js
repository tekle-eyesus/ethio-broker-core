import { Router } from "express";
import {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  uploadClaimDocument,
} from "../controllers/claim.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createClaim).get(getClaims);

router.route("/:id").get(getClaimById).patch(updateClaim);

router
  .route("/:id/documents")
  .post(upload.single("document"), uploadClaimDocument);

export default router;
