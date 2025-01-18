import { Router } from "express";
import {
  addJournalToFolder,
  createJournal,
  deleteJournal,
  getAllJournals,
  getJournal,
  getJournalByDate,
  getJournalMood,
  getJournalsWithFolder,
  updateJournal,
} from "../controllers/journalController.js";

const router = Router();

router.post("/", createJournal);
router.get("/", getAllJournals);
router.get("/mood", getJournalMood);
router.get("/:id", getJournal);
router.get("/folder/:folderId", getJournalsWithFolder);
router.get("/date/:date", getJournalByDate);
router.put("/:id", updateJournal);
router.put("/add-folder/:journalId", addJournalToFolder);
router.delete("/:id", deleteJournal);

export default router;
