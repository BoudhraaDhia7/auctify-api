import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const NotesSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    title: { type: String },
    content: { type: String },
    noteDate: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "created_at" },
    toJSON: { virtuals: true },
  }
);

export const NoteModel = mongoose.model("notes", NotesSchema);
