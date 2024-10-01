import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";
import CustomError from "../utils/CustomError.js";
import { AddNewUserAlert } from "../utils/Helpers.js";

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
