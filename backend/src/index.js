import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { APP_ORIGIN_DEV, APP_ORIGIN_PROD, PORT } from "./constants/env.js";
import errorHandler from "./middleware/errorHandling.js";
import { authenticate } from "./middleware/authenticate.js";
import journalRoutes from "./routes/journalRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";

dotenv.config();

const app = express();

const port = PORT || 5000;

const allowedOrigins = [
  APP_ORIGIN_DEV,
  APP_ORIGIN_PROD,
  "https://mern-writes-backend.onrender.com",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// protected routes
app.use("/api/user", authenticate, userRoutes);
app.use("/api/sessions", authenticate, sessionRoutes);
app.use("/api/notes", authenticate, noteRoutes);
app.use("/api/journals", authenticate, journalRoutes);
app.use("/api/folders", authenticate, folderRoutes);
app.use("/api/moods", authenticate, moodRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is running on port ", port);
  connectDB();
});
