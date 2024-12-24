import { clearAuthCookies } from "../utils/cookies.js";

const handleJoiErro = (res, error) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(400).json({
    message: error.message,
    errors,
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(`PATH: ${req.path}`, error);

  if (req.path === "/api/auth/refresh") {
    clearAuthCookies(res);
  }

  if (error.isJoi) {
    return handleJoiErro(res, error);
  }
  return res.status(500).json("Internal server error");
};

export default errorHandler;
