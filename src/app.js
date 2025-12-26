import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import clientRouter from "./routes/client.routes.js";
import carrierRouter from "./routes/carrier.routes.js";
import policyRouter from "./routes/policy.routes.js";

const app = express();

// Middleware Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/carriers", carrierRouter);
app.use("/api/v1/policies", policyRouter);

export { app };
