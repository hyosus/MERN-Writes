import { Router } from "express";
import { createMood, updateMood } from "../controllers/moodController.js";

const router = Router();

router.post("/", createMood);
router.put("/:id", updateMood);

export default router;
