import { Note } from "../models/noteModel.js";
import { noteIdSchema, noteSchema } from "./noteSchema.js";
import catchErrors from "../utils/catchErrors.js";

export const createNote = catchErrors(async (req, res) => {
  const { error, value } = noteSchema.validate(req.body);
  const { title, content, folder } = value;

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in creating note");
  }

  // get current user
  const user = req.userId;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    throw new Error("Unauthorized");
  }

  // create note
  const note = new Note({
    userId: user,
    title: title,
    content: content,
    folder: folder || null,
  });

  await note.save();
  res.status(201).json(note);
});

export const getAllNotes = catchErrors(async (req, res) => {
  // get current user
  const user = req.userId;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    throw new Error("Unauthorized");
  }

  const notes = await Note.find({ userId: user });
  res.status(200).json(notes);
});

export const getNotesWithoutFolder = catchErrors(async (req, res) => {
  // get current user
  const user = req.userId;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    throw new Error("Unauthorized");
  }
  const notes = await Note.find({ userId: user, folder: null });
  res.status(200).json(notes);
});

export const getNote = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { error, value } = noteIdSchema.validate(id);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in getting note");
  }

  const note = await Note.findById(value);
  if (!note) {
    res.status(404).json({ message: "Note not found" });
    throw new Error("Note not found");
  }

  res.status(200).json(note);
});

export const updateNote = catchErrors(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, folder } = req.body;

    const note = await Note.findById(id);

    if (!note) {
      res.status(404);
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (folder) note.folder = folder;

    await note.save();
    res.status(200).json(note);
  } catch (error) {
    console.log("Error in updating note: ", error);
    error;
  }
});
