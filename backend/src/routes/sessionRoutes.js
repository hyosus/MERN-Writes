import { Router } from "express";
import {
  deleteSessionHandler,
  getSessionHandler,
} from "../controllers/sessionController.js";

const router = Router();

router.get("/", getSessionHandler);
router.delete("/:id", deleteSessionHandler);

export default router;
