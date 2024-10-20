import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";
import CustomError from "../utils/CustomError.js";
import { AddNewUserAlert } from "../utils/Helpers.js";
import { transport } from "../settings.js";

import dotenv from "dotenv";
import { TransactionModel } from "../models/Transactions.js";
import { ProductModel } from "../models/Products.js";
import { AuctionsModel } from "../models/Auctions.js";
import mongoose from "mongoose";
import { BetsModel } from "../models/Bets.js";
dotenv.config();

//register user
export const registerUser = async (req, res, next) => {
  try {
    const defaultAvatar = (userName) => {
      const firstNameAv = firstName.charAt(0).toUpperCase();
      const lastNameAv = lastName.charAt(0).toUpperCase();
      return `https://ui-avatars.com/api/?name=${firstNameAv}+${lastNameAv}&background=6FA1FF&size=256&rounded=true&color=fff`;
    };
    const {
      userName,
      password,
      phone,
      email,
      role,
      firstName,
      lastName,
      address,
      city,
      status,
      wallet_code,
    } = req.body;
    const user = await UserModel.findOne({ userName });
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!userName) {
      return res.status(400).json({ message: "username is required" });
    }
    if (user) {
      next(new CustomError("user already exist", 500));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      avatar: req.file ? req.file.path : defaultAvatar(userName),
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      phone: phone,
      email: email,
      status: status,
      role: role,
      amountRecieved: 0,
      amountSent: 0,
      wallet_code: wallet_code,
      solde: 0,
      password: hashedPassword,
    });
    await newUser.save();
    await AddNewUserAlert(newUser.avatar, `/displayUserInfos/${newUser._id}`, userName);
    return res.status(201).json({ message: "User is successfully created " });
  } catch (error) {
    console.log(error.message);
    next(new CustomError(error.message, 500));
  }
};


export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const isPhone = !isNaN(userName);

    const query = isPhone
      ? { phone: userName } 
      : { $or: [{ userName }, { email: userName }] }; 

    const user = await UserModel.findOne(query);
    
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ isLogin: false, message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: '1h',
    });

    res.status(200).json({
      isLogin: true,
      token,
      idClient: user._id,
      pseudo: user.userName,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login. Please try again later." });
  }
};



//reset password
export const resetPasswordUser = async (req, res, next) => {
  try {
    const { userName, password, newPassword, confirmationNewPassword } =
      req.body;

    const company = await UserModel.findOne({ userName });

    if (!company) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username or password is incorrect" });
    }

    if (newPassword !== confirmationNewPassword) {
      return res
        .status(401)
        .json({ message: "password confirmation doesn't match" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (hashedPassword) await company.updateOne({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//user infos update
export const updatedUser = async (req, res, next) => {
  try {
    const  id  = req.body.id;
    const infos = req.body;
    console.log(req.body);
    const user = await UserModel.findByIdAndUpdate( id, infos, { new: true });
    res.json(
      user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactionByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).populate("UserTransactions");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    console.log;
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
//profile user
export const getProfileByUserId = async (req, res, next) => {
  try {
    const id = req.body.id;
    console.log(id);
    const user = await UserModel.findById(id, { password : 0});
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // if (user._id.toString() !== req.userId) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
//user authorization
export const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, "secret", (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Missing token" });
  }
};

export const getInfosByUserId = async (req, res, next) => {
  const { id } = req.params;
  const userInfosById = await UserModel.findById(id);
  try {
    res.status(200).send(userInfosById);
  } catch (error) {
    res.status(400).json(error);
  }
};


// use nodemailer to send email to user for 


//Update user email
export const updateEmail = async (req, res, next) => {
  try {
    const { id, email } = req.params;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.updateOne({ _id: id }, { $set: { email } });

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


export const updatePassword = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne({ _id: id }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updatePhone = async (req, res, next) => {
  try {
    const { id, phoneNumber: phone } = req.body;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.updateOne({ _id: id }, { $set: { phone } });

    res.status(200).json({ message: "Phone updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const  sendConfirmationEmail = async (req, res) => {
  const { id, email: newEmail } = req.body;
  
  const user = await UserModel.findById(id);

  if (!user) {
    throw new Error("User not found");
  }
  
  const confirmationUrl = `http://${process.env.APP_URL}/auth/changeUserEmail/${user._id}/${newEmail}`;

  const mailOptions = {
    from: '"Auctify" <noreply@auctify.com>',
    to: user.email,
    subject: 'Confirmez Votre Nouvelle Adresse Email',
    html: `
      <h4>Bonjour ${user.userName},</h4>
      <p>Vous avez demandé à changer votre email pour <b>${newEmail}</b>. Veuillez cliquer sur le bouton ci-dessous pour confirmer votre nouvelle adresse email.</p>
      <a href="${confirmationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none;">Confirmer l'Email</a>
    `
  };

  await transport.sendMail(mailOptions);

  res.status(200).json({ message: "Email sent successfully" });
};

export const getTransaction = async (req, res) => {
  const { id } = req.params;

  try {
      let query = {};

      if (id) {
          query.transactionIdentifier = id;
      }

      query.transactionType = 'PARTICIPATION';

      const transactions = await TransactionModel.find(query);

      if (!transactions || transactions.length === 0) {
          return res.status(404).json({ message: 'No transactions found with the provided criteria.' });
      }

      const transactionsWithUsers = await Promise.all(transactions.map(async (transaction) => {
          const user = await UserModel.findById(transaction.profile);
          const sender = await UserModel.findById(transaction.sender);
          return {
              ...transaction.toObject(),
              userProfile: user,
              senderProfile: sender,
              formattedDate: formatDate(transaction.date)
          };
      }));


      res.status(200).json(transactionsWithUsers);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving transactions: ' + error.message });
  }
};

// Function to format the date
const formatDate = (date) => {
  console.log(date);
  const newDate = new Date(date);
  const formattedDate = `${newDate.getDate().toString().padStart(2, '0')}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;
  return formattedDate;
};

export const getAuctionHistory = async (req, res) => {

  const { userId } = req.params;

  try {
    const history = await AuctionsModel.find({ idUser: new mongoose.Types.ObjectId(userId) })
      .populate({
        path: 'idProduct',
        select: 'name files', 
        model: ProductModel
      })
      .exec();
      console.log(history[0].idProduct.files[0].filePath);
      const auctionHistory = await Promise.all(history.map(async auction => {

        const totalBids = await BetsModel.aggregate([
          { $match: { idUser: new mongoose.Types.ObjectId(userId), idProduct: auction.idProduct._id } },
          { $group: { _id: null, totalAmountBid: { $sum: "$amount" } } }
        ]);
  

      let status;
      if (new Date(auction.entryDate) > new Date()) {
        status = 'In Progress';
      } else {
        status = auction.status === 0 ? 'Won' : 'Lost';
      }

      console.log(totalBids);
      return {
        dateOfParticipation: formatDate(auction.created_at),
        status: status,
        productName: auction.idProduct.name,
        productPhoto: auction.idProduct.files.length > 0 ? auction.idProduct.files[0].filePath : 'No photo available',
        totalBids: totalBids[0].totalAmountBid || 0
      };
    }));

    return res.status(200).json(auctionHistory);
  } catch (error) {
    console.error("Failed to fetch auction history:", error);
    return [];
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User with that email does not exist" });
    }

    const token = jwt.sign({ _id: user._id,email :user.email}, "secret", { expiresIn: "60m" });


    const resetUrl = `${process.env.FRONT_URL}/reset-password?key=${token}`;
    
    const mailOptions = {
      from: '"Auctify" <noreply@auctify.com>',
      to: user.email,
      subject: 'Demande de réinitialisation de mot de passe',
      html: `
      <p>Bonjour ${user.userName},</p>
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

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmationNewPassword} = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const isPasswordValid = await bcrypt.compare(newPassword, user.password);

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
      await user.updateOne({ password: hashedPassword });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};