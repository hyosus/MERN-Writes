import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();
const port = process.env.port;

app.use(express.json());
app.use(cors());

app.use("/api/notes", noteRoutes);
// app.use("/api/folders", folderRoutes);

app.listen(port, () => {
  console.log("Server is running on port ", port);
  connectDB();
});
