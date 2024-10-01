import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const SoldeRequestsSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "users" },
  fromId: { type: ObjectId, ref: "users" },
  amount: { type: Number },
  date: { type: Date, default: new Date() },
  status: { type: Number, default: 1 },
});

export const SoldeRequestsModel = mongoose.model(
  "soldeRequests",
  SoldeRequestsSchema
);
