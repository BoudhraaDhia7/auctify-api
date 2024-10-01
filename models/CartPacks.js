import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const CartPackSchema = new mongoose.Schema({

  title: { type: String },
  soldeValue: { type: Number },
  realValue: { type: Number },

})

export const CartPackModel = mongoose.model("cartPacks", CartPackSchema);
