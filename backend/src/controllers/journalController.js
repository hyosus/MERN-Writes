import catchErrors from "../utils/catchErrors.js";
import { journalIdSchema, journalSchema } from "./journalSchema.js";
import { Journal } from "../models/journalModel.js";

export const createJournal = catchErrors(async (req, res) => {
  const { error, value } = journalSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in creating journal");
  }

  const { title, content, mood, folder, date } = value;

  const journal = new Journal({
    userId: req.userId,
    title,
    content,
    mood,
    folder,
    date,
  });

  await journal.save();
  res.status(201).json(journal);
});

export const getAllJournals = catchErrors(async (req, res) => {
  const journals = await Journal.find({ userId: req.userId });
  res.status(200).json(journals);
});

export const getJournal = catchErrors(async (req, res) => {
  const { error, value } = journalIdSchema.validate(req.params.id);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in getting journal");
  }

  const journal = await Journal.findById(value);

  if (!journal) {
    res.status(404).json({ message: "Journal not found" });
    throw new Error("Journal not found");
  }
  res.status(200).json(journal);
});

export const updateJournal = catchErrors(async (req, res) => {
  const { error, value } = journalIdSchema.validate(req.params.id);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in updating journal");
  }
  const id = value;

  const { error: errorBody, value: valueBody } = journalSchema.validate(
    req.body
  );
  if (errorBody) {
    res.status(400).json({ message: errorBody.details[0].message });
    throw new Error("Error in updating journal");
  }

  const journal = await Journal.findById(id);
  if (!journal) {
    res.status(404).json({ message: "Journal not found" });
    throw new Error("Journal not found");
  }

  const { title, content, mood, folder, date } = valueBody;
  if (title) journal.title = title;
  if (content) journal.content = content;
  if (mood) journal.mood = mood;
  if (folder) journal.folder = folder;
  if (date) journal.date = date;

  await journal.save();
  res.status(200).json(journal);
});

export const deleteJournal = catchErrors(async (req, res) => {
  const { error, value: id } = journalIdSchema.validate(req.params.id);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in deleting journal");
  }

  await Journal.findByIdAndDelete(id);
  res.status(200).json({ message: "Journal deleted" });
});
