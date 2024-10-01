import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const BetsSchema = new mongoose.Schema(
  {
    idUser: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    idProduct: {
      type: ObjectId,
      ref: "products",
      required: true,
    },
    amount: { type: Number, default: 1 },
    duration: { type: Number },
  },
  { timestamps: { createdAt: "created_at" } }
);
export const BetsModel = mongoose.model("bets", BetsSchema);
