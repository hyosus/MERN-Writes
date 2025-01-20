import { Router } from "express";
import {
  createMood,
  deleteMood,
  getAllMoods,
  updateMood,
} from "../controllers/moodController.js";

const router = Router();

router.post("/", createMood);
router.get("/", getAllMoods);
router.put("/:id", updateMood);
router.delete("/:id", deleteMood);

export default router;
