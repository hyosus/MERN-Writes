import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";

const defaults = {
  audience: ["user"],
};

const accessTokenOptions = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenOptions = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (payload, options) => {
  const { secret, ...signOpts } = options || accessTokenOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};
