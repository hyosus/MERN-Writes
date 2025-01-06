import { Folder } from "../models/folderModel.js";
import { folderSchema } from "./folderSchema.js";

export const createFolder = async (req, res, next) => {
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
};

export const getAllFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (error) {
    console.log("Error in getting all folders: ", error);
    next(error);
  }
};

export const getNotesFolder = async (req, res, next) => {
  try {
    const folder = await Folder.find({ type: "Note" });
    res.status(200).json(folder);
  } catch (error) {
    console.log("Error in getting notes folder: ", error);
    next(error);
  }
};

export const getJournalFolder = async (req, res, next) => {
  try {
    const folder = await Folder.find({ type: "Journal" });
    res.status(200).json(folder);
  } catch (error) {
    console.log("Error in getting journal folder: ", error);
    next(error);
  }
};
