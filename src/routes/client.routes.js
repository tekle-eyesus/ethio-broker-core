import { Router } from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  uploadClientDocument,
} from "../controllers/client.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createClient).get(getClients);

router
  .route("/:id")
  .get(getClientById)
  .patch(updateClient)
  .delete(deleteClient); // Soft delete

router
  .route("/:id/documents")
  .post(upload.single("document"), uploadClientDocument);

export default router;
