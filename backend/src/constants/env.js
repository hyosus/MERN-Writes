import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const APP_ORIGIN = process.env.APP_ORIGIN;
export const MONGODB_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
