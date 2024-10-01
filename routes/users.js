import express from "express";
import {
  getInfosByUserId,
  getProfileByUserId,
  getTransactionByUserId,
  loginUser,
  registerUser,
  resetPasswordUser,
  updatedUser,
  verifyToken,
} from "../mobileControllers/user.js";
import { upload } from "../utils/multer.js";

const router = express.Router();
//user
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/resetPasswordUser", resetPasswordUser);
router.post("/updateUserInfos", verifyToken, updatedUser);
router.get("/getTransactionsByUser/:id", getTransactionByUserId);
router.post("/getProfileByUserId", verifyToken, getProfileByUserId);
router.get("/getInfosByUserId/:id", getInfosByUserId);

export { router as userRouter };
