import { ParticipantModel } from "../models/Participants.js";
import { UserModel } from "../models/Users.js";
import { SoldeRequestsModel } from "../models/SoldeRequests.js";
import { ProductModel } from "../models/Products.js";
import { v4 as uuidv4 } from "uuid";
import { CreateTransaction, UpdateUserSolde } from "../utils/Helpers.js";
import mongoose from "mongoose";


export const AddToWallet = async (req, res, next) => {
  let transactionIdentifier = uuidv4();
  try {
    const { userId, amountGiven } = req.body;
    const user = await UserModel.findById(userId);
    console.log(user);
    if (!user) {
      return res.json({ message: "User doen't exist!" });
    }

    await CreateTransaction(userId, amountGiven, transactionIdentifier, "ADD_TO_WALLET");

    await UpdateUserSolde(userId, amountGiven);

    return res.status(200).json({
      message: "particpation done successfully",
      participation: newParticipation,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getUserByPhone = async (req, res, next) => {
  const { userId, userPhone } = req.body;
  try {
    const user = await UserModel.findOne({phone : userPhone});
    if (!user) {
      return res.json({ message: "USER_DONT_EXIST" });
    }
    else {
      return res.json({ id: user._id, firstName : user.firstName, lastName : user.lastName, phone: user.phone, avatar: user.avatar,  message: "USER_EXIST" });
    }

  } catch (error) {
      res.status(400).json(error);
    }
};


export const sendSoldeToUser = async (req, res, next) => {
  let transactionIdentifier = uuidv4();
  try {
    const { sender, reciever, amountGiven } = req.body;
    const user = await UserModel.findById(sender);
  
    if (!user) {
      return res.json({ message: "USER_DONT_EXIST" });
    }
    if (user.solde < amountGiven) {
      return res.json({ message: "NOT_ENOUGHT_SOLD" });
    }

    await CreateTransaction(sender, amountGiven, transactionIdentifier, "BETWEEN_USERS", reciever);
    await UpdateUserSolde(sender, amountGiven);
    await UpdateUserSolde(reciever, Math.abs(amountGiven) );

    return res.status(200).json({
      message: "DANNOS_SENDED",
    });

  } catch (error) {
    res.status(400).json(error);
  }
};

export const sendSoldeRequest = async (req, res, next) => {
   const { userId, fromId, amount } = req.body;
   try {
    const newRequest = new SoldeRequestsModel({ userId, fromId, amount });
    await newRequest.save();
    res.status(200).send(newRequest);

   } catch (error) {
    res.status(400).json(error);
   }
};

export const getSoldeRequest = async (req, res, next) => {
  const { userId } = req.body;
  const myId = new mongoose.Types.ObjectId(userId);
  try {

    const _request = await SoldeRequestsModel.aggregate([
      {
        $match : { userId: myId, status : 1 }
      },
      {
        $lookup: {
          from: "users",
          localField: "fromId",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      {
        $unwind: {
          path: "$userInfo",
        }
      },

      {
        $project : {
          _id : 1,
          userId : 1,
          fromId : 1,
          amount : 1,
          date : 1,
          status : 1,
          from_ID : "$userInfo._id",
          from_lastName : "$userInfo.lastName",
          from_firstName : "$userInfo.firstName",
          from_avatar : "$userInfo.avatar"
        }
      },
      {
        $sort : {
          date : -1,
        }
      }

    ]);

    res.status(200).send(_request);

  } catch (error) {
    res.status(400).json(error);
  }

};