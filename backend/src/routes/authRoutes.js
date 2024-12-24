import { Router } from "express";
import {
  loginHandler,
  registerHandler,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerHandler);
router.get("/login", loginHandler);

export default router;
