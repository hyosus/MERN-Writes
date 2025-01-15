import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected to: ", MONGODB_URI);
  } catch (error) {
    console.log("Error connecting to the databas", error);
  }
};
