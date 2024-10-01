import { AuctionsModel } from "../models/Auctions.js";

import mongoose from "mongoose";
import { BetsModel } from "../models/Bets.js";
import { WinnerModel } from "../models/Winners.js";
import { ProductModel } from "../models/Products.js";

export const getAuctionMembers = async (req, res, next) => {
    const { id } = req.params;
    const prodId = new mongoose.Types.ObjectId(id);
    try {
    const auctionMembers = await AuctionsModel.find({idProduct : prodId, status: 1});
      res.status(200).send(auctionMembers);
    } catch (error) {
      res.status(400).json(error);
    }
};

export const getAuctionClassment = async (req, res, next) => {
    const {  productId  } = req.body;
    const idProduct = new mongoose.Types.ObjectId(productId);
    try {
        const classement = await BetsModel.aggregate([
            {
                $match : { idProduct: idProduct }
            },

            {
                $lookup: {
                  from: "users",
                  localField: "idUser",
                  foreignField: "_id",
                  as: "members"
                }
            },
            
            {
                $unwind: {
                    path: "$members",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $addFields: {
                  userName: "$members.userName",
                  avatar: "$members.avatar",
                  firstName: "$members.firstName",
                  lastName: "$members.lastName",
                },
              },
        

            {
                $group : {
                    _id: "$idUser",
                    totalSolde : {
                        $sum: "$amount"
                    },
                    totalTime : {
                        $sum: "$duration"
                    },
                    betUserName : { $first: "$userName" },
                    betAvatar : { $first: "$avatar" }, 
                    betLastName : { $first: "$lastName" }, 
                    betfirstName : { $first: "$firstName" }, 
                }
            },
            {
                $sort : { totalSolde : -1, totalTime: 1 }
            }

        ]);

        res.status(200).send(classement);

    } catch (error) {
      res.status(400).json(error);
    }
};

export const saveAuctionWinner = async (req, res, next) => {
    const { idUser, idProduct, amountPayed, durationPayed } = req.body;
    
    try {
        const newWinner = new WinnerModel({
            product : idProduct,
            player : idUser,
            amountPayed,
            durationPayed
          });
          await newWinner.save();
          res.status(200).send(newWinner);

    } catch (error) {
      res.status(400).json(error);
    }
};

export const getAuctionById = async (req, res, next) => {

    const { productId } = req.body;

    const myProdId= new mongoose.Types.ObjectId(productId);
  
    try {
      const products = await ProductModel.aggregate([
  
        {
          $match : { _id : myProdId }
        },
  
        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "companyInfo"
          }
        },
  
        {
          $unwind: {
            path: "$companyInfo",
          }
        },
  
        { $addFields : {
            companyId : "$companyInfo._id",
            companyName : "$companyInfo.companyName",
            companyLogo : "$companyInfo.logo",
            companyAdress : "$companyInfo.address",
            companyCity : "$companyInfo.city",
            companyCountry : "$companyInfo.country",
            companyEmail : "$companyInfo.email",
            companyPhone : "$companyInfo.phone",
          }
        },
  
        {
          $lookup: {
            from: "participants",
            localField: "_id",
            foreignField: "product",
            as: "members"
          }
        },
  
        {
          $unwind: {
            path: "$members",
            preserveNullAndEmptyArrays: true
          }
        },
  
        {
          $group: {
            _id: "$_id",
            total: {
              $sum: "$members.amountGiven"
            },
            participant :  { $sum: 1 },
            prodName : { $first : "$name"},
            prodPrice : { $first : "$price"},
            prodDescription : { $first : "$description"},
            prodPicture : { $first : "$files"},
            prodBenefit : { $first : "$benefit"},
            companyId : { $first : "$companyId"},
            companyName : { $first : "$companyName"},
            companyLogo : { $first : "$companyLogo"},
            companyAdress : { $first : "$companyAdress"},
            companyCity : { $first : "$companyCity"},
            companyCountry : { $first : "$companyCountry"},
            companyEmail : { $first : "$companyEmail"},
            companyPhone : { $first : "$companyPhone"},
            prodDate : { $first : "$created_at"},
            openDate : { $first : "$openDate"},
            prodStatus : { $first : "$status"},
          }
        },
       
      ]);
  
      res.status(200).send(products);
  
    } catch (error) {
  
      console.log(error);
      res.status(400).send(error.message);
  
    }
  };