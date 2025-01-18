import catchErrors from "../utils/catchErrors.js";
import {
  journalDateSchema,
  journalIdSchema,
  journalSchema,
} from "./journalSchema.js";
import { Journal } from "../models/journalModel.js";
import Joi from "joi";
import { Types } from "mongoose";
import { folderIdSchema } from "./folderSchema.js";

export const createJournal = catchErrors(async (req, res) => {
  console.log("1. Received date in backend:", req.body.date);
  const { error, value } = journalSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in creating journal");
  }

  const { title, content, mood, folder, date } = value;
  console.log("2. Date after validation:", date);

  // Create a UTC date at noon on the specified date
  // This ensures the date remains the same in all timezones
  const [year, month, day] = date.split("-");
  const utcDate = new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      12, // noon UTC
      0,
      0
    )
  );

  const journal = new Journal({
    userId: req.userId,
    title,
    content,
    mood,
    folder,
    date: utcDate,
  });

  console.log("3. Date being saved to MongoDB:", journal.date);
  console.log("4. Date in ISO format:", journal.date.toISOString());

  await journal.save();
  res.status(201).json(journal);
});

export const getAllJournals = catchErrors(async (req, res) => {
  const user = req.userId;
  const { error, value } = Joi.string().length(24).validate(user);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in getting all journals");
  }
  const journals = await Journal.aggregate([
    // Match user's journals
    { $match: { userId: new Types.ObjectId(value) } },

    // Add fields for sorting
    {
      $addFields: {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      },
    },

    // Sort by year descending, then month and day ascending
    {
      $sort: {
        year: -1,
        month: 1,
        day: 1,
      },
    },
  ]);

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

export const getJournalByDate = catchErrors(async (req, res) => {
  const { error, value } = journalDateSchema.validate(req.params.date);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in getting journal");
  }

  const journals = await Journal.find({ date: value, userId: req.userId });
  if (!journals) {
    res.status(404).json({ message: "Journal not found" });
    throw new Error("Journal not found");
  }
  res.status(200).json(journals);
});

export const getJournalMood = catchErrors(async (req, res) => {
  const journals = await Journal.find({ userId: req.userId }).populate("mood");
  if (!journals) {
    res.status(404).json({ message: "Journals not found" });
    throw new Error("Journals not found");
  }

  // Process the results to filter out duplicate moods for each date
  const uniqueMoodsByDate = journals.reduce((acc, journal) => {
    const date = journal.date.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = new Set();
    }
    journal.mood.forEach((mood) => {
      acc[date].add(JSON.stringify(mood)); // Use JSON.stringify to handle object comparison
    });
    return acc;
  }, {});

  // Convert the sets back to arrays and parse the JSON strings
  const result = Object.entries(uniqueMoodsByDate).map(([date, moods]) => ({
    date,
    mood: Array.from(moods).map((mood) => JSON.parse(mood)),
  }));

  res.status(200).json(result);
});

export const getJournalsWithFolder = catchErrors(async (req, res) => {
  const { value, error } = journalIdSchema.validate(req.params.folderId);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in getting journals with folder");
  }

  const folderId = value;

  const journals = await Journal.find({
    userId: req.userId,
    folders: folderId,
  });
  if (!journals) {
    res.status(404).json({ message: "Journals not found" });
    throw new Error("Journals not found");
  }
  res.status(200).json(journals);
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
  if (folder) journal.folders = [...journal.folders, folder];
  if (date) journal.date = date;

  await journal.save();
  res.status(200).json(journal);
});

export const addJournalToFolder = catchErrors(async (req, res) => {
  console.log("1. Folder id from params: ", req.params.journalId);
  const { error, value } = journalIdSchema.validate(req.params.journalId);

  console.log("2. Folder id after validation: ", value);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in updating journal");
  }
  const id = value;

  const journal = await Journal.findById(id);
  if (!journal) {
    res.status(404).json({ message: "Journal not found" });
    throw new Error("Journal not found");
  }

  const { folderId } = req.body;
  if (!folderId) {
    res.status(400).json({ message: "Folder ID and Entry ID are required" });
    throw new Error("Folder ID and Entry ID are required");
  }

  // Add the journal to the folder
  journal.folders.push(folderId);
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

export const removeFolderFromJournals = catchErrors(async (req, res) => {
  const { error, value } = folderIdSchema.validate(req.params.folderId);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in removing folder from journals");
  }

  const folderId = value;
  const journals = await Journal.find({ folders: folderId });
  if (!journals) {
    res.status(404).json({ message: "Journals not found" });
    throw new Error("Journals not found");
  }

  // Remove the folder from each journal
  for (let journal of journals) {
    journal.folders = journal.folders.filter(
      (folder) => folder.toString() !== folderId
    );
    await journal.save();
  }

  res.status(200).json({ message: "Folder removed from journals" });
});
