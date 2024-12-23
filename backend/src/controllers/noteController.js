import { Note } from "../models/noteModel.js";

export const createNote = async (req, res, next) => {
  try {
    const { title, content, folder } = req.body;
    const noteData = {};

    if (title) noteData.title = title;
    if (content) noteData.content = content;
    if (folder) noteData.folder = folder;

    const note = new Note(noteData);

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.log("Error in creating note: ", error);
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in getting all notes: ", error);
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
