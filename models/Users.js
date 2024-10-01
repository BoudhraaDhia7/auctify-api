import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    avatar: { type: String },
    address: { type: String },
    city: { type: String },
    email: { type: String },
    phone: { type: Number },
    amountRecieved: { type: Number },
    amountSent: { type: Number },
    status: { type: Number },
    role: { type: Number, default: 2 },
    solde: { type: Number },
    fb_id: { type: String },
    twitter_id: { type: String },
    google_id: { type: String },
    wallet_code: { type: Number },
    pushToken: { type: String },
  },
  { toJSON: { virtuals: true }, 
    timestamps: { createdAt: "created_at" }
  },

);

UserSchema.virtual("UserTransactions", {
  ref: "transactions",
  localField: "_id",
  foreignField: "profile",
  justOne: false,
});

UserSchema.virtual("UsersNotes", {
  ref: "notes",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});


export const UserModel = mongoose.model("users", UserSchema);
