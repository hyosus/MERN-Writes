import { Router } from "express";
import { getSessionHandler } from "../controllers/sessionController.js";

const router = Router();

router.get("/", getSessionHandler);

export default router;
