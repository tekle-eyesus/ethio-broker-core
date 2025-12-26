import { Router } from "express";
import {
  createCarrier,
  getCarriers,
  updateCarrier,
  deleteCarrier,
} from "../controllers/carrier.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createCarrier).get(getCarriers);
router.route("/:id").patch(updateCarrier).delete(deleteCarrier);

export default router;
