import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const WinnerSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "products" },
  player: { type: ObjectId, ref: "users" },
  amountPayed: { type: Number },
  date: { type: Date, default: new Date() },
});

export const WinnerModel = mongoose.model("winners", WinnerSchema);
