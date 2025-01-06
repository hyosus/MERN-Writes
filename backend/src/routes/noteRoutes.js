import { Router } from "express";
import {
  createNote,
  getAllNotes,
  getNotesWithoutFolder,
  updateNote,
} from "../controllers/noteController.js";

const router = Router();

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/no-folder", getNotesWithoutFolder);
router.put("/:id", updateNote);

export default router;
