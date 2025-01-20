import { Router } from "express";
import {
  addNoteToFolder,
  createNote,
  getAllNotes,
  getNote,
  getNotesWithFolder,
  getNotesWithoutFolder,
  updateNote,
} from "../controllers/noteController.js";

const router = Router();

router.get("/no-folder", getNotesWithoutFolder);
router.put("/add-folder", addNoteToFolder);
router.get("/folder/:folderId", getNotesWithFolder);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.post("/", createNote);
router.get("/", getAllNotes);

export default router;
