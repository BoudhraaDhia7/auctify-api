import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CompanyModel } from "../models/Companies.js";
import CustomError from "../utils/CustomError.js";
import { ProductModel } from "../models/Products.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import {UserModel} from "../models/Users.js";
import { transport } from "../settings.js";
//register company
export const registerCompany = async (req, res, next) => {
  try {
    const { password, userName, companyName, email, phone } = req.body;
    console.log(req.body, userName, companyName, email, phone);

    // Check if the user already exists (by username or email)
    const user = await CompanyModel.findOne({
      $or: [{ userName: userName }, { email: email }],
    });

    if (user) {
      return res.status(400).json({
        message: "Nom d'utilisateur ou email déjà utilisé",
      });
    }

    // Validate the inputs
    if (typeof userName !== 'string') {
      return res.status(400).json({
        message: "Le nom d'utilisateur doit être une chaîne de caractères",
      });
    }
    if (typeof password !== 'string') {
      return res.status(400).json({
        message: "Le mot de passe doit être une chaîne de caractères",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Le mot de passe est requis",
      });
    }
    if (!userName) {
      return res.status(400).json({
        message: "Le nom d'utilisateur est requis",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new CompanyModel({
      userName: userName,
      password: hashedPassword,
      companyName: companyName,
      email: email,
      phone: phone,
      responsable: '',
      role: 1, // Set a default role
      status: 1, // Active status
      logo: `https://ui-avatars.com/api/?name=${userName.charAt(0)}+${companyName.charAt(0)}&background=6FA1FF&size=256&rounded=true&color=fff`,
      matricule_fiscale: '',
      address: '',
      city: '',
      country: '',
    });

    // Save the new user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, "secret");

    // Return the token and user data
    return res.status(201).json({
      message: "Entreprise enregistrée avec succès",
      token,
      userID: newUser._id,
      roleID: newUser.role,
    });
  } catch (error) {
    console.log(error.message);
    next(new CustomError(error.message, 500));
  }
};

//login company
export const loginCompany = async (req, res) => {
  const { userName, password } = req.body;

  const user = await CompanyModel.findOne({
    $or: [{ userName: userName }, { email: userName }],
  });
  try {
    if (!user) {
      return res.status(200).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
    if (user.status === 3) {
      return res.status(200).json({ message: "L'utilisateur est restreint" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ message: "Le mot de passe est incorrect" });
    }
    console.log(password, userName);
    const token = jwt.sign({ id: user._id,role:user.role }, "secret");
    res.json({ token, userID: user._id, roleID: user.role });
  } catch (error) {
    res.status(400).json({ error });
  }
};


// get products by company
export const getProductByCompanyId = async (req, res, next) => {
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
//reset password

//company infos update
export const updatedCompanyProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const infos = req.body;
    const company = await CompanyModel.findByIdAndUpdate(id, infos, {
      new: true,
    });
    res.json({
      data: company,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentConnectedUserInfos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUser = await CompanyModel.findById(id);
    res.status(200).json({ currentUser });
  } catch (error) {
    console.error("cannot fetch current user information");
  }
};

export const getInfosByCompanyId = async (req, res, next) => {
  const { id } = req.params;
  const companyInfosById = await CompanyModel.findById(id);
  try {
    res.status(200).send(companyInfosById);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email, isUser } = req.body;
  console.log(email, isUser);
  console.log(await UserModel.find());
  const Model = isUser ? UserModel : CompanyModel;
  
  try {
    const entity = await Model.findOne({ email });

    if (!entity) {
      return res
        .status(404)
        .json({ error: "User with that email does not exist" });
    }

    const token = jwt.sign({ _id: entity._id, email: entity.email }, "secret", { expiresIn: "60m" });

    const resetUrl = `http://127.0.0.1:5173/reset-password?key=${token}`;
    const mailOptions = {
      to: entity.email,
      subject: "Demande de réinitialisation de mot de passe",
      html: `
      <p>Bonjour ${entity.userName},</p>
      <p>Vous recevez cet e-mail parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.</p>
      <p>Veuillez cliquer sur le bouton suivant ou le copier dans votre navigateur pour compléter le processus:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
      <p>Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.</p>
      `,
    };

    await transport.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

export const resetPasswordCompany = async (req, res, next) => {

    const { email, newPassword, confirmationNewPassword } = req.body;

    try {
    const user = await UserModel.findOne({ email });
    const company = await CompanyModel.findOne({ email});


    if (!user && !company) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isPasswordValid = await bcrypt.compare(newPassword, user?.password || company?.password);

    if (isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Le nouveau mot de passe doit être différent du mot de passe actuel" });
    }

    if (newPassword !== confirmationNewPassword) {
      return res
        .status(400)
        .json({ message: "Password confirmation doesn't match" });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (hashedPassword) {
        if(user)
          await user.updateOne({ password : hashedPassword });
        else
          await company.updateOne({ password : hashedPassword });
    }
 
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updatePasswordCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {oldPassword,newPassword,confirmNewPassword}=req.body;
    const company = await CompanyModel.findById(id);
    const isPasswordValid = await bcrypt.compare(oldPassword, company.password);
    if (!isPasswordValid) {
      return res
          .status(400)
          .json({ message: "wrong old password" });
    }

    if(isPasswordValid){
      if (newPassword !== confirmNewPassword) {
        return res
            .status(400)
            .json({ message: "Password confirmation doesn't match" });
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (hashedPassword) {
      await company.updateOne({ password: hashedPassword });
    }
    res.status(200).json( "password upadted with success" );
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateEmailCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {newEmail,confirmationPassword}=req.body;
    const company = await CompanyModel.findById(id);
    const isPasswordValid = await bcrypt.compare(confirmationPassword, company.password);
    if (!isPasswordValid) {
      return res
          .status(400)
          .json({ message: "incorrect password" });
    }

    if (isPasswordValid) {
      await company.updateOne({ email: newEmail });
    }
    res.status(200).json( "email updated with success" );
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getInProgressCompanyProducts = async (req, res, next) => {
  try {
    const companyId = req.params.companyId; // Assuming you pass the company ID as a request parameter
    const files = await ProductModel.aggregate([
      {
        $match: {
          status: 2,
          company: new mongoose.Types.ObjectId(companyId), // Filter by company ID
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

export const restrictCompany = async (req, res, next) => {
  const { companyId } = req.params;
  try {
    const user = await CompanyModel.findByIdAndUpdate(
        companyId,
        { status: 3 },
        { new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    throw new Error("Failed to update user status");
  }
};
export const unRestrictCompany = async (req, res, next) => {
  const { companyId } = req.params;
  try {
    const user = await CompanyModel.findByIdAndUpdate(
        companyId,
        { status: 1 },
        { new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    throw new Error("Failed to update user status");
  }
};