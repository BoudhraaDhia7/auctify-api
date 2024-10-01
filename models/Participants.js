import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const ParticipantSchema = new mongoose.Schema({
  
  product: { type: ObjectId, ref: "products" },
  player: { type: ObjectId, ref: "users" },
  amountGiven: { type: Number, required: true },
  date: { type: Date, default: new Date() },
});

export const ParticipantModel = mongoose.model(
  "participant",
  ParticipantSchema
);
