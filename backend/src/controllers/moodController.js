import { Mood } from "../models/moodModel.js";
import catchErrors from "../utils/catchErrors.js";
import { moodSchema } from "./moodSchema.js";

export const createMood = catchErrors(async (req, res) => {
  const { error, value } = moodSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in creating mood: ", error.details[0].message);
  }

  const { name, emoji, colour, isCustom, userId } = value;
  const mood = new Mood({ name, emoji, colour, isCustom, userId });
  await mood.save();
  res.status(201).json(mood);
});

export const getAllMoods = catchErrors(async (req, res) => {
  // get default moods plus moods created by the user
  const moods = await Mood.find({
    $or: [{ isCustom: false || null }, { userId: req.userId }],
  }).sort({ userId: -1 });
  res.status(200).json(moods);
});

export const updateMood = catchErrors(async (req, res) => {
  const { error, value } = moodSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in updating mood");
  }

  const { name, emoji, colour, isCustom, userId } = value;
  const mood = await Mood.findById(req.params.id);
  if (!mood) {
    res.status(404).json({ message: "Mood not found" });
    throw new Error("Mood not found");
  }

  mood.name = name;
  mood.emoji = emoji;
  mood.colour = colour;
  mood.isCustom = isCustom;
  mood.userId = userId;

  await mood.save();
  res.json(mood);
});

export const deleteMood = catchErrors(async (req, res) => {
  const result = await Mood.findByIdAndDelete(req.params.id);
  if (!result) {
    res.status(404).json({ message: "Mood not found" });
    throw new Error("Mood not found");
  }

  res.status(204).end();
});
