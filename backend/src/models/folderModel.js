import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Note", "Journal"], // Only allow "Note" or "Journal"
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
        required: false,
      },
    ],
    journals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journal",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export const Folder = mongoose.model("Folder", folderSchema);
