import { Router } from "express";
import {
  createFolder,
  getAllFolders,
  getJournalFolder,
  getNotesFolder,
} from "../controllers/folderController.js";

const router = Router();

router.get("/", getAllFolders);
router.get("/note", getNotesFolder);
router.get("/journal", getJournalFolder);

router.post("/", createFolder);

export default router;
