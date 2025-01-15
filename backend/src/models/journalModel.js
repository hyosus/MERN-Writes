import mongoose, { Schema } from "mongoose";

const journalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  mood: [
    {
      type: Schema.Types.ObjectId,
      ref: "Mood",
      required: false,
    },
  ],
  folder: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
});

export const Journal = mongoose.model("Journal", journalSchema);
