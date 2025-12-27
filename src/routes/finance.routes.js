import { Router } from "express";
import {
  createTransaction,
  getPolicyStatement,
  getFinancialReport,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Record Payment
router.route("/transactions").post(createTransaction);

// Get Report (General)
router.route("/report").get(getFinancialReport);

// Get Specific Policy Statement
router.route("/policy/:policyId").get(getPolicyStatement);

export default router;
