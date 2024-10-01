import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const TransactionSchema = new mongoose.Schema({
  transactionIdentifier: { type: String, required: true },
  transactionType: { type: String, default : "PARTICIPATION" },
  amount: { type: Number, required: true },
  realAmount: { type: Number, required: true },
  profile: { type: ObjectId, ref: "users" },
  receiver: { type: ObjectId, ref: "users" },
  sender: { type: ObjectId, ref: "users" },
  date: { type: Date, default: new Date() },
});

export const TransactionModel = mongoose.model(
  "transactions",
  TransactionSchema
);
