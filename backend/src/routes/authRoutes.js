import { Router } from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/logout", logoutHandler);
router.get("/refresh", refreshHandler);
router.get("/verify-email/:code", verifyEmailHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

export default router;
