import { Note } from "../models/noteModel.js";
import { noteSchema } from "./noteSchema.js";
import catchErrors from "../utils/catchErrors.js";

export const createNote = catchErrors(async (req, res, next) => {
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

export const getAllNotes = catchErrors(async (req, res, next) => {
  // get current user
  const user = req.userId;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    throw new Error("Unauthorized");
  }

  const notes = await Note.find({ userId: user });
  res.status(200).json(notes);
});

export const getNotesWithoutFolder = async (req, res, next) => {
  try {
    const notes = await Note.find({ folder: null });
    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in getting notes without folder: ", error);
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
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
    next(error);
  }
};
