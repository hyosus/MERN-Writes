import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) throw new Error("Not authorized");

  const { error, payload } = verifyToken(accessToken);
  if (!payload)
    throw new Error(
      error === "jwt expired" ? "Token expired" : "Invalid token"
    );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
};
