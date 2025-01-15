import { Router } from "express";
import {
  createMood,
  getAllMoods,
  updateMood,
} from "../controllers/moodController.js";

const router = Router();

router.post("/", createMood);
router.get("/", getAllMoods);
router.put("/:id", updateMood);

export default router;
