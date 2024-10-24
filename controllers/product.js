import mongoose from "mongoose";
import { ProductModel } from "../models/Products.js";
import { AddNewProdAlert } from "../utils/Helpers.js";
import { CartPackModel } from "../models/CartPacks.js";
import { UserModel } from "../models/Users.js";
import { io } from "../index.js";

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
      status: -1,
      benefit:req.body.benefit,
      openDate:req.body.openDate,
      files: fileArray,
    });

    await product.save();
    await AddNewProdAlert(req.body.company,`/productinfo/${product._id}`, req.body.name)
    res.status(201).send("product added successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getProducts = async (req, res, next) => {

  const {cid} = req.params;
  const companyId = cid != "--" ? new mongoose.Types.ObjectId(cid) : null;
  var match = companyId ? { status: 1, company: companyId} : { status: 1}
  
  try {
    const files = await ProductModel.aggregate([
      {
        $match: match
      },
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
          prodStatus: { $first: "$status" },
        },
      },

      {
        $sort: {
          prodDate: -1,
        },
      },
    ]);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getPendingProducts = async (req, res, next) => {

  const {cid} = req.params;
  const companyId = cid != "--" ? new mongoose.Types.ObjectId(cid) : null;
  var match = companyId ? { status: -1, company: companyId} : { status: -1}
  
  try {
    const files = await ProductModel.aggregate([
      {
        $match: match
      },
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
          prodStatus: { $first: "$status" },
        },
      },

      {
        $sort: {
          prodDate: -1,
        },
      },
    ]);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const confirmProduct = async (req, res, next) => {
  const { prodId } = req.body;
  const myId = new mongoose.Types.ObjectId(prodId);
  try {
    await ProductModel.findByIdAndUpdate(myId, { status: 1 });
    res.status(200).send("product confirmed successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getInProgressProducts = async (req, res, next) => {
  const {cid} = req.params;
  const companyId = cid != "--" ? new mongoose.Types.ObjectId(cid) : null;
  var match = companyId ? { status: 2, company: companyId} : { status: 2}
  try {
    const files = await ProductModel.aggregate([

      {
        $match: match
      },
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
        $sort: {
          prodDate: -1,
        },
      },

    ]);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getEndedProducts = async (req, res, next) => {

  const {cid} = req.params;
  const companyId = cid != "--" ? new mongoose.Types.ObjectId(cid) : null;
  var match = companyId ? { status: 3, company: companyId} : { status: 3}

  try {
    const files = await ProductModel.aggregate([

        {
          $match: match
        },
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
        $sort: {
          prodDate: -1,
        },
      },
      {
        $lookup: {
          from: "winners",
          localField: "_id",
          foreignField: "product",
          as: "winnerInfo",
        },
      },
      {
        $unwind: {
          path: "$winnerInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "winnerInfo.player",
          foreignField: "_id",
          as: "winnerInfo.playerInfo",
        },
      },
      {
        $unwind: {
          path: "$winnerInfo.playerInfo",
        },
      },
      {
        $addFields: {
          winnerName: "$winnerInfo.playerInfo.userName",
        },
      },

    ]);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getProductById = async (req, res, next) => {

  const { prodId } = req.body;
  const myId = new mongoose.Types.ObjectId(prodId);

  try {
    const products = await ProductModel.aggregate([

      {
        $match : { _id : myId  }
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


export const buyPack = async (req, res) => {
  const { packId } = req.body;
  console.log(packId);
  try {
    const pack = await CartPackModel.findById(packId);
    if (!pack) {
      return res.status(404).json({ message: 'Le pack demandé est introuvable.' });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    user.solde = (user.solde || 0) + pack.soldeValue;

    await user.save();

    return res.status(200).json({
      message: 'Félicitations ! Vous avez acheté le pack avec succès.',
      newSolde: `Votre nouveau solde est de ${user.solde} DT.`,
      finalSolde: user.solde,
    });
  } catch (error) {
    console.error('Erreur lors de l\'achat du pack:', error);
    return res.status(500).json({ message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.' });
  }
};
