import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const SavedProductsSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "users" },
  productId: { type: ObjectId, ref: "products" },
  date: { type: Date, default: new Date() },
  status: { type: Number, default: 1 },
});

export const SavedProductsModel = mongoose.model("savedProducts", SavedProductsSchema);
