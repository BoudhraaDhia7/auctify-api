import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CompanyModel } from "../models/Companies.js";
import CustomError from "../utils/CustomError.js";
import { ProductModel } from "../models/Products.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import {UserModel} from "../models/Users.js";
//register company
export const registerCompany = async (req, res, next) => {
  try {
    const { password, userName } = req.body;
    const user = await CompanyModel.findOne({ userName });

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!userName) {
      return res.status(400).json({ message: "username is required" });
    }
    if (user) {
      return res.status(400).json({ message: "user already exist" });

    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new CompanyModel({
      userName: userName,
      companyName: req.body.companyName,
      responsable: req.body.responsable,
      matricule_fiscale: req.body.matricule_fiscale,
      email: req.body.email,
      role: req.body.role,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      password: hashedPassword,
      phone: req.body.phone,
      status: req.body.status,
      commerceRegister: req.files.commerceRegister[0].path,
      logo: req.files.logo[0].path,
    });
    await newUser.save();
    return res.status(201).json({ message: "User is successfully created " });
  } catch (error) {
    console.log(error.message);
    next(new CustomError(error.message, 500));
  }
};

//login company
export const loginCompany = async (req, res) => {
  const { userName, password } = req.body;
  const test = await CompanyModel.find();
  console.log(test);
  const user = await CompanyModel.findOne({ userName });
  try {
    if (!user) {
      return res.status(200).json({ message: "User doen't exist!" });
    }
    if (user.status === 3) {
      return res.status(200).json({ message: "Company is restricted." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ message: "Username or password is incorrect" });
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
  const { email } = req.body;

  try {
    const user = await CompanyModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User with that email does not exist" });
    }

    const token = jwt.sign({ _id: user._id,email :user.email}, "secret", { expiresIn: "60m" });

    // Send an email to the user's email address with the token and link to reset password page
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mr.iheb.mehrzi@gmail.com",
        pass: "wuvncvuxssbzdedl",
      },
    });

    const resetUrl = `http://127.0.0.1:5173/reset-password?key=${token}`;
    const mailOptions = {
      from: "mr.iheb.mehrzi@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `Hello ${user.userName},\n\nYou are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\nPlease click on the following link or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

export const resetPasswordCompany = async (req, res, next) => {
  try {
    const { email, newPassword, confirmationNewPassword} = req.body;

    const company = await CompanyModel.findOne({ email });

    if (!company) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isPasswordValid = await bcrypt.compare(newPassword, company.password);

    if (isPasswordValid) {
      return res
          .status(400)
          .json({ message: "New password must be different from the current password" });
    }

    if (newPassword !== confirmationNewPassword) {
      return res
          .status(400)
          .json({ message: "Password confirmation doesn't match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (hashedPassword) {
      await company.updateOne({ password: hashedPassword });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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