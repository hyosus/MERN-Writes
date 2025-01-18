import { Router } from "express";
import {
  createFolder,
  getAllFolders,
  getJournalFolder,
  getNotesFolder,
  addNoteToFolder,
  addJournalToFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  removeJournalFromFolder,
} from "../controllers/folderController.js";

const router = Router();

router.get("/", getAllFolders);
router.get("/note", getNotesFolder);
router.get("/journal", getJournalFolder);
router.get("/:id", getFolder);

router.put("/:folderId", updateFolder);

router.put("/add-note/:id", addNoteToFolder);
router.put("/add-journal/:id", addJournalToFolder);
router.put("/remove-journal/:folderId", removeJournalFromFolder);

router.post("/", createFolder);
router.delete("/:folderId", deleteFolder);

export default router;
