import { CompanyModel } from "../models/Companies.js";
import { ParticipantModel } from "../models/Participants.js";
import { UserModel } from "../models/Users.js";
import { TransactionModel } from "../models/Transactions.js";
import { ProductModel } from "../models/Products.js";
import mongoose from "mongoose";
import {WinnerModel} from "../models/Winners.js";
import moment from "moment";
export const companiesList = async (req, res, next) => {
  try {
    const companies = await CompanyModel.find();
    res.status(200).send(companies);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const usersList = async (req, res, next) => {
  try {
    const participants = await ParticipantModel.aggregate([
      {
        $group: {
          _id: "$player",
          count: { $sum: 1 },
        },
      },
    ]);
    const users = await UserModel.find();
    const usersWithCounts = users.map((user) => {
      const participationCount = participants.find(
        (p) => p._id.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        participationCount: participationCount ? participationCount.count : 0,
      };
    });
    res.status(200).send(usersWithCounts);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const totalUsers = async (req, res, next) => {
  try {
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          status: { $push: "$status" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          active: {
            $size: {
              $filter: {
                input: "$status",
                as: "status",
                cond: { $eq: ["$$status", 1] },
              },
            },
          },
          inactive: {
            $size: {
              $filter: {
                input: "$status",
                as: "status",
                cond: { $ne: ["$$status", 1] },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const totalSolde = async (req, res, nex) => {
  try {
    const solde = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$solde",
          },
          totalReceived: {
            $sum: "$amountRecieved",
          },
          totalSent: {
            $sum: "$amountSent",
          },
        },
      },

      {
        $project: {
          total: 1,
          totalReceived: 1,
          totalSent: 1,
        },
      },
    ]);

    res.status(200).json(solde[0]);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const totalParticipants = async (req, res, next) => {
  try {
    const totalWinners = await WinnerModel.aggregate([
      {
        $group: {
          _id: null,
          totalWinners: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalWinners: 1,
        },
      },
    ]);

    const participation = await ParticipantModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          status: { $push: "$status" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
        },
      },
    ]);

    const winnersCount = totalWinners[0]?.totalWinners || 0;
    const participantsCount = participation[0]?.total || 0;
    const losers = participantsCount - winnersCount;

    res.status(200).json({ totalWinners: winnersCount, participation: participantsCount, losers });
  } catch (error) {
    res.status(400).json(error);
  }
};


export const totalCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          status: { $push: "$status" },
        },
      },
      {
        $project: {
          _id: 0,
          total: { $subtract: ["$total", 1] },
          active: {
            $subtract: [
              {
                $size: {
                  $filter: {
                    input: "$status",
                    as: "status",
                    cond: { $eq: ["$$status", 1] },
                  },
                },
              },
              1, // subtract 1 from active
            ],
          },
          inactive: {
            $size: {
              $filter: {
                input: "$status",
                as: "status",
                cond: { $ne: ["$$status", 1] },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({ companies });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const totalProds = async (req, res, next) => {
  try {
    const prods = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          status: { $push: "$status" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          encours: {
            $size: {
              $filter: {
                input: "$status",
                as: "status",
                cond: { $eq: ["$$status", 2] },
              },
            },
          },
          terminer: {
            $size: {
              $filter: {
                input: "$status",
                as: "status",
                cond: { $eq: ["$$status", 3] },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({ prods });
  } catch (error) {
    res.status(400).json(error);
  }
};
export const totalProdsSolde = async (req, res, next) => {
  try {
    const prodsSolde = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
          multipliedBenefit: { $sum: { $multiply: ["$price", "$benefit"] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalPrice: 1,
          multipliedBenefit: 1,
          totalBenefit: { $subtract: ["$totalPrice", "$multipliedBenefit"] },
        },
      },
    ]);

    res.status(200).json({ prodsSolde });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const ProdsByCompanyId = async (req, res, next) => {
  const { id } = req.params;
  const cid = new mongoose.Types.ObjectId(id);
  try {
    const files = await ProductModel.aggregate([
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
        $match: {
          companyId: cid,
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

export const totalProdsByCompanyId = async (req, res, next) => {
  const { id } = req.params;
  const cid = new mongoose.Types.ObjectId(id);

  try {
    const result = await ProductModel.aggregate([
      {
        $match: { company: cid }
      },
      {
        $group: {
          _id: "$company",
          totalProducts: { $sum: 1 },
          totalInProgressProducts: { $sum: { $cond: [{ $eq: ["$status", 2] }, 1, 0] } },
          totalEndedProducts: { $sum: { $cond: [{ $eq: ["$status", 3] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getTotalProductParticipatedByCompanyId = async (req, res, next) => {
  const { id } = req.params;
  const cid = new mongoose.Types.ObjectId(id);
  try {
    const result = await ProductModel.aggregate([
      {
        $match: {
          company: cid,
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
          _id: "$company",
          totalSoldeParticipationByCompany: {
            $sum: "$members.amountGiven",
          },
          totalPrice: {
            $sum: "$price",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSoldeParticipationByCompany: 1,
          totalPrice: 1,
        },
      },

    ]);

    const company = result[0]; // Get the first company from the result array
    const totalProductsPrice = await ProductModel.aggregate([
      {
        $match: {
          company: cid,
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: "$price",
          },
        },
      },
      {
        $addFields: {
          benefits: {
            $subtract: ["$totalPrice", "$totalSoldeParticipationByCompany"],
          },
        },
      },
    ]);

    company.totalPrice = totalProductsPrice[0]?.totalPrice || 0; // Update the totalPrice field

    res.status(200).send({ result: [company] });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const productsParticipationByCompanyId = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const cid = new mongoose.Types.ObjectId(companyId);

    const products = await ProductModel.aggregate([
      {
        $match: {
          company: cid,
        },
      },
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "product",
          as: "participation",
        },
      },
      {
        $match: {
          participation: { $ne: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participation.player",
          foreignField: "_id",
          as: "participation.player",
        },
      },
      {
        $unwind: "$participation.player",
      },
      {
        $group: {
          _id: "$participation.player",
          totalAmountSent: {
            $sum: "$participation.player.amountSent",
          },
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchUsersByName = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    const users = await UserModel.aggregate([
      {
        $match: {
          $or: [
            { userName: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      },
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "player",
          as: "participationCount",
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          firstName: 1,
          lastName: 1,
          password: 1,
          avatar: 1,
          address: 1,
          city: 1,
          email: 1,
          phone: 1,
          amountRecieved: 1,
          amountSent: 1,
          status: 1,
          role: 1,
          solde: 1,
          wallet_code: 1,
          participationCount: { $size: "$participationCount" },
        },
      },
    ]);

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error);
  }
};


export const searchCompaniesByName = async (req, res, next) => {
  try {
    const { companyName } = req.body;


    const companies = await CompanyModel.find({
      $or: [
        {companyName: {$regex: companyName, $options: 'i'}},
        { phone: { $regex: companyName, $options: 'i' } }
         ]
    });

    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json(error);
  }
};


export const searchProductsByName = async (req, res, next) => {
  try {
    const { productName } = req.body;


    const products = await ProductModel.find({ name: { $regex: productName, $options: 'i' } });

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};


//total products prices per month
export const totalProductsSoldePerMonth = async (req, res, next) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const result = await ProductModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$created_at" },
          },
          totalPrice: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalPrice: 1,
        },
      },
    ]);

    const formattedResult = result.map((item) => {
      const monthName = monthNames[item.month - 1]; // Map month number to month name
      return {
        ...item,
        month: monthName,
      };
    });

    if (formattedResult.length > 0) {
      res.status(200).json(formattedResult);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error calculating total price per month:", error);
    throw error;
  }
};


//total participations (money) per month
export const totalSoldeParticipationPerMonth = async (req, res, next) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const result = await ParticipantModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" },
          },
          totalAmountGiven: { $sum: "$amountGiven" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalAmountGiven: 1,
        },
      },
    ]);

    const formattedResult = result.map((item) => {
      const monthName = monthNames[item.month - 1];
      return {
        ...item,
        month: monthName,
      };
    });

    if (formattedResult.length > 0) {
      res.status(200).json(formattedResult);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};



//total money by participation group by company
export const totalAmountByCompany = async (req, res, next) => {
  try {
    const result = await ParticipantModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "productInfo.company",
          foreignField: "_id",
          as: "companyInfo",
        },
      },
      {
        $group: {
          _id: "$productInfo.company",
          companyName: { $first: { $arrayElemAt: ["$companyInfo.companyName", 0] } },
          totalAmount: { $sum: "$amountGiven" },
        },
      },
      {
        $project: {
          _id: 0,

          companyName: 1,
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const topParticipant = async (req, res, next) => {
  try {
    const top = await ParticipantModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "player",
          foreignField: "_id",
          as: "userInfos",
        },
      },
      {
        $group: {
          _id: "$player",
          playerName: { $first: "$userInfos.userName" },
          playerAvatar: { $first: "$userInfos.avatar" },
          totalAmountGiven: { $sum: "$amountGiven" },
        },
      },
      {
        $sort: { totalAmountGiven: -1 },
      },
      {
        $project: {
          _id: 0,
          playerName: { $arrayElemAt: ["$playerName", 0] },
          playerAvatar: { $arrayElemAt: ["$playerAvatar", 0] },
          totalAmountGiven: 1,
        },
      },
    ]);

    res.status(200).json(top);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//last 5 products added
export const lastAddedProducts = async (req, res, next) => {
  try {
    const lastProducts = await ProductModel.find()
        .sort({ created_at: -1 })
        .limit(5)
        .populate("company");

    res.status(200).json(lastProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getParticipationCount = async (req, res, next) => {
  const { userId, dateDebut, dateFin } = req.body;
  const user = new mongoose.Types.ObjectId(userId);
  try {
    const formattedDateDebut = moment(dateDebut).format("YYYY-MM-DD");
    const formattedDateFin = moment(dateFin).format("YYYY-MM-DD");
    console.log(formattedDateDebut,formattedDateFin)
    const participationCount = await ParticipantModel.aggregate([
      {
        $match: {
          player: user,
          date: {
            $gte: new Date(formattedDateDebut),
            $lte: new Date(formattedDateFin),
          },
        },
      },
      {
        $group: {
          _id: "$player",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "playerData",
        },
      },
      {
        $unwind: "$playerData",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          playerName: {
            $concat: ["$playerData.firstName", " ", "$playerData.lastName"],
          },
          dateDebut: formattedDateDebut,
          dateFin: formattedDateFin,
        },
      },
    ]);

    res.status(200).json(participationCount);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const acceptCompanyRequest = async (req, res, next) => {
  const { companyId } = req.params;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mr.iheb.mehrzi@gmail.com",
      pass: "wuvncvuxssbzdedl",
    },
  });
  try {
    const user = await CompanyModel.findByIdAndUpdate(
        companyId,
        { status: 1 },
        { new: true }
    );
    const mailOptions = {
      from: "mr.iheb.mehrzi@gmail.com",
      to: user.email,
      subject: "Company Acceptance Notification",
      text: "Dear Company, your request has been accepted. You can now access the application.",    };
    await transporter.sendMail(mailOptions);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json("failed");
  }
};

export const companyRapport = async (req, res, next) => {
  try {
    const { dateDebut, dateFin } = req.body;
    const formattedDateDebut = moment(dateDebut).format("YYYY-MM-DD");
    const formattedDateFin = moment(dateFin).format("YYYY-MM-DD");

    const data = await CompanyModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "company",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "participants",
          localField: "products._id",
          foreignField: "product",
          as: "participants",
        },
      },
      {
        $addFields: {
          totalProductCount: { $size: "$products" },
          totalParticipation: { $size: "$participants" },
          totalProductsPrice: { $sum: "$products.price" },
          totalInProgressProds: {
            $sum: {
              $cond: [{ $in: [2, "$products.status"] }, 1, 0],
            },
          },
          totalEndedProds: {
            $sum: {
              $cond: [{ $in: [3, "$products.status"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          companyName: 1,
          totalProductCount: 1,
          totalParticipation: 1,
          totalProductsPrice: 1,
          address: 1,
          logo: 1,
          created_at: 1,
          totalInProgressProds: 1,
          totalEndedProds: 1,
        },
      },
      {
        $match: {
          companyName: { $ne: "admin" },
          created_at: {
            $gte: new Date(formattedDateDebut),
            $lte: new Date(formattedDateFin),
          },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const productRapport = async (req, res, next) => {
  const { dateDebut, dateFin } = req.body;
  try {
    const formattedDateDebut = moment(dateDebut).format("YYYY-MM-DD");
    const formattedDateFin = moment(dateFin).format("YYYY-MM-DD");

    const data = await ProductModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(formattedDateDebut),
            $lte: new Date(formattedDateFin),
          },
        },
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
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "product",
          as: "participants",
        },
      },
      {
        $project: {
          _id: 0,
          productName: "$name",
          companyName: { $arrayElemAt: ["$companyInfo.companyName", 0] },
          created_at: 1,
          price: 1,
          openDate: 1,
          firstPicture: { $arrayElemAt: ["$files", 0] },
          amountGiven: { $sum: "$participants.amountGiven" },
          participationCount: { $size: "$participants" },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};


export const usersRapport = async (req, res, next) => {
  const { dateDebut, dateFin } = req.body;
  try {
    const formattedDateDebut = moment(dateDebut).format("YYYY-MM-DD");
    const formattedDateFin = moment(dateFin).format("YYYY-MM-DD");

    const data = await UserModel.aggregate([
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "player",
          as: "participations",
        },
      },
      {
        $lookup: {
          from: "winners",
          localField: "_id",
          foreignField: "player",
          as: "wins",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "wins.product",
          foreignField: "_id",
          as: "productsWon",
        },
      },
      {
        $match: {
          created_at: {
            $gte: new Date(formattedDateDebut),
            $lte: new Date(formattedDateFin),
          },
        },
      },
      {
        $project: {
          _id: 0,
          userName: 1,
          participationCount: { $size: "$participations" },
          winCount: { $size: "$wins" },
          created_at :1,
          phone:1,
          productsWon: {
            $map: {
              input: "$productsWon",
              as: "product",
              in: {
                name: "$$product.name",
                picture: { $arrayElemAt: ["$$product.files", 0] },
              },
            },
          },
          solde: 1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};