import { ParticipantModel } from "../models/Participants.js";
import { UserModel } from "../models/Users.js";
import { ProductModel } from "../models/Products.js";
import { v4 as uuidv4 } from "uuid";
import { CreateTransaction, UpdateUserSolde } from "../utils/Helpers.js";
import mongoose from "mongoose";
import {WinnerModel} from "../models/Winners.js";

export const registerForProduct = async (req, res, next) => {
  let transactionIdentifier = uuidv4();
  try {
    const { player, product, amountGiven } = req.body;
    const user = await UserModel.findById(player);
    const prod = await ProductModel.findById(product);

    if (!user) {
      return res.json({ message: "User doen't exist!" });
    }
    if (user.solde < amountGiven) {
      return res.json({ message: "solde is not enough to participate" });
    }

    const newParticipation = new ParticipantModel({
      amountGiven: Math.abs(amountGiven),
      product: product,
      player: player,
    });

    await newParticipation.save();

    await CreateTransaction(player, amountGiven, transactionIdentifier, 'PARTICIPATION');

    await UpdateUserSolde(player, amountGiven)

    return res.status(200).json({
      message: "particpation done successfully",
      participation: newParticipation,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const amountByProduct = async (req, res, next) => {
  try {
    const result = await ParticipantModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalAmount: { $sum: "$amountGiven" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 1,
          productName: "$product.name",
          totalAmount: 1,
        },
      },
    ]);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(message.error);
  }
};

export const getProductsParticipatedByUser = async (req, res, next) => {
  const { id } = req.params;
  const myId = new mongoose.Types.ObjectId(id);

  try {
    const products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyInfo",
        },
      },

      {
        $unwind: {
          path: "$companyInfo",
        },
      },

      {
        $addFields: {
          companyId: "$companyInfo._id",
          companyName: "$companyInfo.companyName",
          companyLogo: "$companyInfo.logo",
          companyAdress: "$companyInfo.address",
          companyCity: "$companyInfo.city",
          companyCountry: "$companyInfo.country",
          companyEmail: "$companyInfo.email",
          companyPhone: "$companyInfo.phone",
        },
      },

      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "product",
          as: "members",
        },
      },

      {
        $unwind: {
          path: "$members",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$_id",
          total: {
            $sum: "$members.amountGiven",
          },
          myTotal: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$members.player", myId],
                },
                then: "$members.amountGiven",
                else: 0,
              },
            },
          },
          prodName: { $first: "$name" },
          prodPrice: { $first: "$price" },
          prodDescription: { $first: "$description" },
          prodPicture: { $first: "$files" },
          prodBenefit: { $first: "$benefit" },
          companyId: { $first: "$companyId" },
          companyName: { $first: "$companyName" },
          companyLogo: { $first: "$companyLogo" },
          companyAdress: { $first: "$companyAdress" },
          companyCity: { $first: "$companyCity" },
          companyCountry: { $first: "$companyCountry" },
          companyEmail: { $first: "$companyEmail" },
          companyPhone: { $first: "$companyPhone" },
          prodDate: { $first: "$created_at" },
        },
      },
      {
        $match: {
          myTotal: { $gt: 0 },
        },
      },
      {
        $sort: {
          prodDate: -1,
        },
      },
    ]);

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const participationInfosByUserId = async (req, res, next) => {
  const { id } = req.params;
  const userId = new mongoose.Types.ObjectId(id);

  try {
    const [participationCount, winCount, totalAmount, totalWon] = await Promise.all([
      ParticipantModel.aggregate([
        { $match: { player: userId } },
        { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: "$amountGiven" } } },
        { $project: { _id: 0, count: 1, totalAmount: 1 } }
      ]),
      WinnerModel.countDocuments({ player: userId }),
      ParticipantModel.aggregate([
        { $match: { player: userId } },
        { $group: { _id: null, totalAmount: { $sum: "$amountGiven" } } },
        { $project: { _id: 0, totalAmount: 1 } }
      ]),
      WinnerModel.aggregate([
        { $match: { player: userId } },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        { $unwind: "$productInfo" },
        { $group: { _id: null, totalWon: { $sum: "$productInfo.price" } } },
        { $project: { _id: 0, totalWon: 1 } }
      ])
    ]);

    const participationCountValue = participationCount.length > 0 ? participationCount[0].count : 0;
    const winCountValue = winCount;
    const totalAmountValue = totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;
    const totalWonValue = totalWon.length > 0 ? totalWon[0].totalWon : 0;

    res.status(200).json({
      participationCount: participationCountValue,
      winCount: winCountValue,
      totalAmount: totalAmountValue,
      totalWon: totalWonValue
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
