import {
  ProductModel
} from "../models/Products.js";

import { SavedProductsModel } from "../models/SavedProducts.js";

import mongoose from "mongoose";

export const createProduct = async (req, res, next) => {
  try {
    let fileArray = [];
    req.files.forEach((element) => {
      const file = {
        productPicture: element.originalname,
        filePath: element.path,
        fileType: element.mimetype,
        fileSize: element.size,
      };
      fileArray.push(file);
    });
    const product = ProductModel({
      name: req.body.name,
      company: req.body.company,
      price: req.body.price,
      description: req.body.description,
      files: fileArray,
    });
    await product.save();
    res.status(201).send("product added successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getProducts = async (req, res, next) => {

  const { userId } = req.body;
  const myId = userId != '' ? new mongoose.Types.ObjectId(userId) : null;

  try {
    const products = await ProductModel.aggregate([

      {
        $match : { status : 1 }
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
          myTotal: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$members.player", (myId)]
                },
                then: "$members.amountGiven",
                else: 0
              }
            }
          },
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
      {
        $sort : {
          prodDate : -1
        }
      }
    ]);

    res.status(200).send(products);

  } catch (error) {

    res.status(400).send(error.message);

  }

};



export const getParticipatedProducts = async (req, res, next) => {

  const { userId } = req.body;
  const myId = new mongoose.Types.ObjectId(userId);

  try {
    const products = await ProductModel.aggregate([

      {
        $match : { status : { $in: [ 1, 2 ] } }
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
          myTotal: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$members.player", (myId)]
                },
                then: "$members.amountGiven",
                else: 0
              }
            }
          },
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
      {
        $match: {
            "myTotal": { $gt: 0 }
        }
      },
      {
        $sort : {
          prodStatus : -1
        }
      }
    ]);

    res.status(200).send(products);

  } catch (error) {

    console.log(error);
    res.status(400).send(error.message);

  }
};


export const getInProgressProducts = async (req, res, next) => {

  const { userId } = req.body;
  const myId = userId != '' ? new mongoose.Types.ObjectId(userId) : null;

  try {
    const products = await ProductModel.aggregate([

      {
        $match : { status : 2  }
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
          myTotal: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$members.player", (myId)]
                },
                then: "$members.amountGiven",
                else: 0
              }
            }
          },
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
      {
        $sort : {
          prodStatus : -1
        }
      }
    ]);

    res.status(200).send(products);

  } catch (error) {

    console.log(error);
    res.status(400).send(error.message);

  }
};

export const getEndedProducts = async (req, res, next) => {

  const { userId } = req.body;
  const myId = userId != '' ? new mongoose.Types.ObjectId(userId) : null;

  try {
    const products = await ProductModel.aggregate([

      {
        $match : { status : 3  }
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
          myTotal: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$members.player", (myId)]
                },
                then: "$members.amountGiven",
                else: 0
              }
            }
          },
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
      {
        $sort : {
          prodStatus : -1
        }
      }
    ]);

    res.status(200).send(products);

  } catch (error) {

    console.log(error);
    res.status(400).send(error.message);

  }
};

export const setFavProduct = async (req, res, next) => {
  const { userId, productId } = req.body;
  try {
    const saved = SavedProductsModel({
      userId : userId,
      productId : productId,
    });
    await saved.save();
    res.status(200).send(saved);

 } catch (error) {
    res.status(400).send(error.message);
  }
};



export const getFavProduct = async (req, res, next) => {
  const { userId} = req.body;
  const myId = new mongoose.Types.ObjectId(userId);
  try {
    const saved = await SavedProductsModel.aggregate([
      {
        $match : { userId:  myId}
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "products"
        }
      },

      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true
        }
      },

      { $addFields : {
          productName : "$products.name",
          productFiles : "$products.files",
          productStatus : "$products.status",
        }
      },

      { $project : 
        {
          _id : 1,
          userId : 1,
          productId : 1,
          productName : 1,
          productFiles: 1,
          date : 1,
          status : 1,
          productStatus : 1
        }
      },


    ]);

    res.status(200).send(saved);

 } catch (error) {
    res.status(400).send(error.message);
  }
};


export const getAuctionById = async (req, res, next) => {

  const { userId, productId } = req.body;
  const myId = new mongoose.Types.ObjectId(userId);
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
          myTotal: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$members.player", (myId)]
                },
                then: "$members.amountGiven",
                else: 0
              }
            }
          },
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
      {
        $match: {
            "myTotal": { $gt: 0 }
        }
      },
    ]);

    res.status(200).send(products);

  } catch (error) {

    console.log(error);
    res.status(400).send(error.message);

  }
};


