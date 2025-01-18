import { Router } from "express";
import {
  createFolder,
  getAllFolders,
  getJournalFolder,
  getNotesFolder,
  addNoteToFolder,
  addJournalToFolder,
} from "../controllers/folderController.js";

const router = Router();

router.get("/", getAllFolders);
router.get("/note", getNotesFolder);
router.get("/journal", getJournalFolder);

router.put("/add-note/:id", addNoteToFolder);
router.put("/add-journal/:id", addJournalToFolder);

router.post("/", createFolder);

export default router;
