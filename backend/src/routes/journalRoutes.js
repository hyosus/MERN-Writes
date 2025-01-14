import { Router } from "express";
import {
  createJournal,
  deleteJournal,
  getAllJournals,
  getJournal,
  updateJournal,
} from "../controllers/journalController.js";

const router = Router();

router.post("/", createJournal);
router.get("/", getAllJournals);
router.get("/:id", getJournal);
router.put("/:id", updateJournal);
router.delete("/:id", deleteJournal);

export default router;
