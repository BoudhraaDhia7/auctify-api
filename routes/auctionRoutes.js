import express from "express";
import { AuctionModel } from "../models/Auctions.js";
const router = express.Router();

router.get("/connectedUsers", async (res, req) => {
  try {
    const connectedUsers = await AuctionModel.aggregate([
      {
        $match: { status: 1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    res.status(200).json(connectedUsers);
  } catch (error) {
    res.status(400).json({ error });
  }
});
