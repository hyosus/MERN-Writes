import catchErrors from "../utils/catchErrors.js";
import { Folder } from "../models/folderModel.js";
import { folderSchema } from "./folderSchema.js";

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

  const { name, type, note, journal } = value;
  if (!name || !type) {
    res.status(400).json({ message: "Name and type are required" });
    throw new Error("Error in creating folder");
  }

  const newFolder = new Folder({
    userId: user,
    name: name,
    type: type,
    note: note || null,
    journal: journal || null,
  });

  await newFolder.save();
  res.status(201).json(newFolder);
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
