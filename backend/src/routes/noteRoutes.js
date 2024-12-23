import { Router } from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
} from "../controllers/noteController.js";

const router = Router();

router.post("/", createNote);
router.get("/", getAllNotes);
router.put("/:id", updateNote);

export default router;
