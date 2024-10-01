import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    files: [Object],
    company: {
      type: ObjectId,
      ref: "companies",
      required: true,
    },
    price: { type: Number },
    benefit: { type: Number, default: 1 },
    description: { type: String },
    status: { type: Number, default: 1, required: true },
    openDate: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at" } }
);
export const ProductModel = mongoose.model("products", ProductSchema);
