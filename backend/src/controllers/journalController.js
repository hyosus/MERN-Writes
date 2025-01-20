import catchErrors from "../utils/catchErrors.js";
import {
  journalDateSchema,
  journalIdSchema,
  journalSchema,
} from "./journalSchema.js";
import { Journal } from "../models/journalModel.js";
import Joi from "joi";
import mongoose, { Types } from "mongoose";

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

  const { title, content, mood, folders, date } = valueBody;
  if (title) journal.title = title;
  if (content) journal.content = content;
  if (mood) journal.mood = mood;
  if (date) journal.date = date;
  if (folders) journal.folders = folders;

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

// Helper function to get the start and end dates for a given period
const getTimePeriod = (period) => {
  const endDate = new Date();
  let startDate;
  switch (period) {
    case "1 Month":
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "3 Months":
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case "6 Months":
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "1 Year":
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid period specified");
  }
  return { startDate, endDate };
};

export const getTopMoods = catchErrors(async (req, res) => {
  const { period } = req.query;
  const userId = new mongoose.Types.ObjectId(req.userId);

  const { startDate, endDate } = getTimePeriod(period);

  const pipeline = [
    // Match user's journals
    {
      $match: {
        userId: userId,
        mood: { $exists: true, $ne: [] },
        date: { $gte: startDate, $lte: endDate },
      },
    },

    // Unwind the mood array
    {
      $unwind: "$mood",
    },

    // Lookup mood details
    {
      $lookup: {
        from: "moods",
        let: { moodId: "$mood" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$moodId"],
              },
            },
          },
        ],
        as: "moodDetails",
      },
    },

    // Unwind the looked up mood details
    {
      $unwind: "$moodDetails",
    },

    // Group by mood to get counts
    {
      $group: {
        _id: "$moodDetails._id",
        name: { $first: "$moodDetails.name" },
        emoji: { $first: "$moodDetails.emoji" },
        colour: { $first: "$moodDetails.colour" },
        count: { $sum: 1 },
        dates: { $push: "$date" },
        isCustom: { $first: "$moodDetails.isCustom" },
      },
    },

    // Add additional fields
    {
      $addFields: {
        lastUsed: { $max: "$dates" },
        firstUsed: { $min: "$dates" },
      },
    },

    // Sort by count descending
    {
      $sort: { count: -1, name: 1 },
    },

    // Limit to top 6 moods
    {
      $limit: 6,
    },

    // Clean up the output
    {
      $project: {
        _id: 1,
        name: 1,
        emoji: 1,
        colour: 1,
        count: 1,
        lastUsed: 1,
        firstUsed: 1,
        isCustom: 1,
      },
    },
  ];

  const moodTrends = await Journal.aggregate(pipeline);

  res.status(200).json(moodTrends);
});

// Helper function to get top 5 mood IDs
const getTopMoodIds = async (userId) => {
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        mood: { $exists: true, $ne: [] },
      },
    },
    { $unwind: "$mood" },
    {
      $group: {
        _id: "$mood",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { _id: 1 } },
  ];

  const results = await Journal.aggregate(pipeline);
  return results.map((r) => r._id);
};

// Get mood streaks
export const getMoodStreaks = catchErrors(async (req, res) => {
  const { period } = req.query;
  const userId = new mongoose.Types.ObjectId(req.userId);

  const { startDate, endDate } = getTimePeriod(period);

  const pipeline = [
    // Match user's journals
    {
      $match: {
        userId: userId,
        mood: { $exists: true, $ne: [] },
        date: { $gte: startDate, $lte: endDate },
      },
    },

    // Sort by date
    { $sort: { date: 1 } },

    // Create a document for each mood
    { $unwind: "$mood" },

    // Group by mood and create arrays of dates
    {
      $group: {
        _id: "$mood",
        dates: { $push: "$date" },
      },
    },

    // Lookup mood details
    {
      $lookup: {
        from: "moods",
        localField: "_id",
        foreignField: "_id",
        as: "moodDetails",
      },
    },
    { $unwind: "$moodDetails" },

    // Calculate streaks
    {
      $addFields: {
        streaks: {
          $reduce: {
            input: "$dates",
            initialValue: {
              currentStreak: 1,
              maxStreak: 1,
              lastDate: { $arrayElemAt: ["$dates", 0] },
              currentStartDate: { $arrayElemAt: ["$dates", 0] },
              maxStreakStartDate: { $arrayElemAt: ["$dates", 0] },
              maxStreakEndDate: { $arrayElemAt: ["$dates", 0] },
            },
            in: {
              $let: {
                vars: {
                  daysDiff: {
                    $divide: [
                      { $subtract: ["$$this", "$$value.lastDate"] },
                      1000 * 60 * 60 * 24,
                    ],
                  },
                },
                in: {
                  currentStreak: {
                    $cond: [
                      { $eq: ["$$daysDiff", 1] },
                      { $add: ["$$value.currentStreak", 1] },
                      1,
                    ],
                  },
                  maxStreak: {
                    $max: [
                      "$$value.maxStreak",
                      {
                        $cond: [
                          { $eq: ["$$daysDiff", 1] },
                          { $add: ["$$value.currentStreak", 1] },
                          "$$value.maxStreak",
                        ],
                      },
                    ],
                  },
                  lastDate: "$$this",
                  currentStartDate: {
                    $cond: [
                      { $eq: ["$$daysDiff", 1] },
                      "$$value.currentStartDate",
                      "$$this",
                    ],
                  },
                  maxStreakStartDate: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$$daysDiff", 1] },
                          {
                            $gt: [
                              { $add: ["$$value.currentStreak", 1] },
                              "$$value.maxStreak",
                            ],
                          },
                        ],
                      },
                      "$$value.currentStartDate",
                      "$$value.maxStreakStartDate",
                    ],
                  },
                  maxStreakEndDate: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$$daysDiff", 1] },
                          {
                            $gt: [
                              { $add: ["$$value.currentStreak", 1] },
                              "$$value.maxStreak",
                            ],
                          },
                        ],
                      },
                      "$$this",
                      "$$value.maxStreakEndDate",
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },

    // Format output
    {
      $project: {
        _id: 1,
        name: "$moodDetails.name",
        emoji: "$moodDetails.emoji",
        colour: "$moodDetails.colour",
        maxStreak: "$streaks.maxStreak",
        currentStreak: "$streaks.currentStreak",
        maxStreakPeriod: {
          start: "$streaks.maxStreakStartDate",
          end: "$streaks.maxStreakEndDate",
        },
      },
    },

    // Sort by max streak descending
    { $sort: { maxStreak: -1, name: 1 } },
  ];

  const results = await Journal.aggregate(pipeline);
  res.status(200).json(results);
});

// Get mood trends
export const getMoodTrends = catchErrors(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  const topMoodIds = await getTopMoodIds(userId);
  const { period } = req.query;

  const { startDate, endDate } = getTimePeriod(period);

  const pipeline = [
    // Match user's journals
    {
      $match: {
        userId: userId,
        mood: { $exists: true, $ne: [] },
        date: { $gte: startDate, $lte: endDate },
      },
    },

    // Create a document for each mood
    { $unwind: "$mood" },

    // Only include top 6 moods
    {
      $match: {
        mood: { $in: topMoodIds },
      },
    },

    // Group by month and mood
    {
      $group: {
        _id: {
          mood: "$mood",
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        count: { $sum: 1 },
      },
    },

    // Lookup mood details
    {
      $lookup: {
        from: "moods",
        localField: "_id.mood",
        foreignField: "_id",
        as: "moodDetails",
      },
    },
    { $unwind: "$moodDetails" },

    // Format the output
    {
      $project: {
        _id: 0,
        mood: {
          _id: "$moodDetails._id",
          name: "$moodDetails.name",
          emoji: "$moodDetails.emoji",
          colour: "$moodDetails.colour",
        },
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: 1,
          },
        },
        count: 1,
      },
    },

    // Sort by date
    { $sort: { date: 1 } },

    // Group all data by mood
    {
      $group: {
        _id: "$mood._id",
        mood: { $first: "$mood" },
        trends: {
          $push: {
            date: "$date",
            count: "$count",
          },
        },
      },
    },
  ];

  const results = await Journal.aggregate(pipeline);
  res.status(200).json(results);
});
