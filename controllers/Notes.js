import { NoteModel } from "../models/Notes.js";
import { UserModel } from "../models/Users.js";

export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newNote = await NoteModel.create({ title, content, user: user._id });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getNotesByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).populate("UsersNotes");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
