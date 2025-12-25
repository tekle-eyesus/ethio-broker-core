import { Router } from "express";
import { createClient, getClients, getClientById, updateClient, deleteClient } from "../controllers/client.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(createClient)
    .get(getClients);

router.route("/:id")
    .get(getClientById)
    .patch(updateClient)
    .delete(deleteClient); // Soft delete

export default router;