import { Folder } from "../models/folderModel.js";

export const getAllFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (error) {
    console.log("Error in getting all folders: ", error);
    next(error);
  }
};

export const createFolder = async (req, res, next) => {
  try {
    const { name, type, note, journal } = req.body;

    if (!name || !type)
      res.status(400).json({ message: "Name and type are required" });

    const newFolder = new Folder({
      name,
      type,
      note: note || null,
      journal: journal || null,
    });

    await newFolder.save();
  } catch (error) {
    console.log("Error in creating folder: ", error);
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
