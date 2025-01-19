import { Router } from "express";
import {
  createFolder,
  getAllFolders,
  getJournalFolder,
  getNotesFolder,
  addNoteToFolder,
  getFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController.js";

const router = Router();

router.get("/", getAllFolders);
router.get("/note", getNotesFolder);
router.get("/journal", getJournalFolder);
router.get("/:id", getFolder);

router.put("/:folderId", updateFolder);

router.put("/add-note/:id", addNoteToFolder);

router.post("/", createFolder);
router.delete("/:folderId", deleteFolder);

export default router;
