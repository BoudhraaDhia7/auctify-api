import mongoose from "mongoose";

const AlertsSchema = new mongoose.Schema({
  avatar: { type: String },
  nickname: { type: String },
  content: { type: String },
  link: { type: String },
  date: { type: Date, default: new Date() },
  status: { type: Number, default: 0 },
});

export const AlertsModel = mongoose.model(
  "alerts",
  AlertsSchema
);
