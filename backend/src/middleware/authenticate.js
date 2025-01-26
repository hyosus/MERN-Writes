import catchErrors from "../utils/catchErrors.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = catchErrors(async (req, res, next) => {
  console.log("All Cookies:", req.cookies);
  console.log("Headers:", req.headers);

  const accessToken = req.cookies.accessToken;
  console.log("Access Token Received:", accessToken);

  if (!accessToken) throw new Error("InvalidAccessToken");

  const { error, payload } = verifyToken(accessToken);
  console.log("Token verification result:", { error, payload });

  if (!payload) {
    console.log("Token verification failed:", error);

    throw new Error(
      error === "jwt expired" ? "Token expired" : "InvalidAccessToken"
    );
  }

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
});
