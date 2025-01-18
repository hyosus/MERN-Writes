import catchErrors from "../utils/catchErrors.js";
import { Folder } from "../models/folderModel.js";
import {
  folderIdSchema,
  folderSchema,
  folderUpdateSchema,
} from "./folderSchema.js";

export const createFolder = catchErrors(async (req, res) => {
  // validate request
  const { error, value } = folderSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in creating folder");
  }

  // get user
  const user = req.userId;
  if (!user) {
    res.status(400).json({ message: "Unauthorised" });
    throw new Error("Unauthorised");
  }

  const { name, type, colour, note, journal } = value;
  if (!name || !type) {
    res.status(400).json({ message: "Name and type are required" });
    throw new Error("Error in creating folder");
  }

  const newFolder = new Folder({
    userId: user,
    name: name,
    type: type,
    colour: colour || "#FFFFFF",
    note: note || null,
    journal: journal || null,
  });

  await newFolder.save();
  res.status(201).json(newFolder);
});

export const updateFolder = catchErrors(async (req, res) => {
  const { error, value } = folderIdSchema.validate(req.params.folderId);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in updating folder");
  }

  const folderId = value;

  const folder = await Folder.findById(folderId);
  if (!folder) {
    res.status(404).json({ message: "Folder not found" });
    throw new Error("Folder not found");
  }

  const { name, colour } = req.body;
  if (name) folder.name = name;
  if (colour) folder.colour = colour;

  await folder.save();
  res.status(200).json(folder);
});

export const getAllFolders = catchErrors(async (req, res) => {
  // get user
  const user = req.userId;
  if (!user) {
    res.status(400).json({ message: "Unauthorised" });
    throw new Error("Unauthorised");
  }

  const folders = await Folder.find({ userId: user });
  res.status(200).json(folders);
});

export const getFolder = catchErrors(async (req, res) => {
  const { error, value } = folderIdSchema.validate(req.params.id);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in getting folder");
  }

  // get user
  const user = req.userId;
  if (!user) {
    res.status(400).json({ message: "Unauthorised" });
    throw new Error("Unauthorised");
  }

  const folder = await Folder.findById(value);
  if (!folder) {
    res.status(404).json({ message: "Folder not found" });
    throw new Error("Folder not found");
  }

  res.status(200).json(folder);
});

export const getNotesFolder = catchErrors(async (req, res) => {
  // get user
  const user = req.userId;
  if (!user) {
    res.status(400).json({ message: "Unauthorised" });
    throw new Error("Unauthorised");
  }

  const folder = await Folder.find({ userId: user, type: "Note" });
  res.status(200).json(folder);
});

export const getJournalFolder = catchErrors(async (req, res) => {
  // get user
  const user = req.userId;
  if (!user) {
    res.status(400).json({ message: "Unauthorised" });
    throw new Error("Unauthorised");
  }

  const folder = await Folder.find({ userId: user, type: "Journal" });
  res.status(200).json(folder);
});

export const addNoteToFolder = catchErrors(async (req, res) => {
  const { error, value } = folderSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in updating folder");
  }

  const folder = await Folder.findById(req.params.id);
  if (!folder) {
    res.status(404).json({ message: "Folder not found" });
    throw new Error("Folder not found");
  }

  const { note, name, type } = value;
  if (name) folder.name = name;
  if (type) folder.type = type;

  // Add notes to the folder
  if (Array.isArray(note)) {
    folder.notes = [...folder.notes, ...note];
  } else if (note) {
    folder.notes.push(note);
  }
  // folder.notes = [...folder.notes, ...note];
  await folder.save();

  res.status(200).json(folder);
});

export const addJournalToFolder = catchErrors(async (req, res) => {
  const { error, value } = folderUpdateSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in updating folder");
  }

  const folder = await Folder.findById(req.params.id);
  if (!folder) {
    res.status(404).json({ message: "Folder not found" });
    throw new Error("Folder not found");
  }

  const { journal, name, type } = value;
  if (name) folder.name = name;
  if (type) folder.type = type;

  // Add notes to the folder
  if (Array.isArray(journal)) {
    folder.journals = [...folder.journals, ...journal];
  } else if (journal) {
    folder.journals.push(journal);
  }
  // folder.journals = [...folder.journals, ...journal];
  await folder.save();

  res.status(200).json(folder);
});

export const deleteFolder = catchErrors(async (req, res) => {
  const { error, value } = folderIdSchema.validate(req.params.folderId);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in deleting folder");
  }

  const id = value;

  await Folder.findByIdAndDelete(id);

  res.status(200).json({ message: "Folder deleted" });
});

export const removeJournalFromFolder = catchErrors(async (req, res) => {
  const { error, value } = folderIdSchema.validate(req.params.folderId);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    throw new Error("Error in removing journal from folders");
  }

  const folderId = value;

  const { journalId } = req.body;
  const folder = await Folder.findById(folderId);
  if (!folder) {
    res.status(404).json({ message: "Folder not found" });
    throw new Error("Folder not found");
  }

  folder.journals = folder.journals.filter(
    (journal) => journal.toString() !== journalId
  );
  await folder.save();

  res.status(200).json({ message: "Journal removed from folders" });
});
