import { Router } from "express";
import {
  createFolder,
  getAllFolders,
  getJournalFolder,
  getNotesFolder,
  addNoteToFolder,
  getFolder,
} from "../controllers/folderController.js";

const router = Router();

router.get("/", getAllFolders);
router.get("/note", getNotesFolder);
router.get("/journal", getJournalFolder);
router.get("/:id", getFolder);

router.post("/", createFolder);

router.put("/add-note/:id", addNoteToFolder);

export default router;
