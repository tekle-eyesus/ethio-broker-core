import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      if (process.env.NODE_ENV !== "development") {
        console.log(`⚡ Server is running at port : ${process.env.PORT}`);
      }
    });
  })
  .catch((err) => {
    // only for development logging
    if (process.env.NODE_ENV === "development") {
      console.log("MONGO db connection failed !!! ", err);
    }
  });
