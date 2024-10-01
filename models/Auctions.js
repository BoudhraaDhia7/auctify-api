import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const AuctionsSchema = new mongoose.Schema(
  {
    nickname: { type: String },
    idSocket: { type: String },
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
    avatar: {
      type: String,
    },
    status: { type: Number, default: 1, required: true },
    amount: { type: Number, default: 0, required: true },
    entryDate: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);
export const AuctionsModel = mongoose.model("auctions", AuctionsSchema);
