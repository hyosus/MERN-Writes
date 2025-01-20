import { Router } from "express";
import {
  createJournal,
  deleteJournal,
  getAllJournals,
  getJournal,
  getJournalByDate,
  getJournalMood,
  getJournalsWithFolder,
  getMoodStreaks,
  getMoodTrends,
  getTopMoods,
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
router.delete("/:id", deleteJournal);

// routes for charts
router.get("/mood-trend/most-used", getTopMoods);
router.get("/mood-trend/streaks", getMoodStreaks);
router.get("/mood-trend/trend", getMoodTrends);

export default router;
