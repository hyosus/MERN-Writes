import { Router } from "express";
import { getUserHandler } from "../controllers/userController.js";

const router = Router();

router.get("/", getUserHandler);

export default router;
