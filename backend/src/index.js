import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { APP_ORIGIN, PORT } from "./constants/env.js";
import errorHandler from "./middleware/errorHandling.js";
import catchErrors from "./utils/catchErrors.js";
import { authenticate } from "./middleware/authenticate.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookParser());

app.get(
  "/",
  catchErrors(async (req, res) => {
    throw new Error("This is an error test");
  })
);
app.use(errorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);

// protected routes
app.use("/api/user", authenticate, userRoutes);
app.use("/api/sessions", authenticate, sessionRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
  connectDB();
});
