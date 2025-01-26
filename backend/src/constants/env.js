import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const APP_ORIGIN =
  NODE_ENV === "production"
    ? process.env.APP_ORIGIN_PROD
    : process.env.APP_ORIGIN_DEV;
export const MONGODB_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const RESEND_APIKEY = process.env.RESEND_APIKEY;
