import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  isCustom: {
    type: Boolean,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export const Mood = mongoose.model("Mood", moodSchema);
