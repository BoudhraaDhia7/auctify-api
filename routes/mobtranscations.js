import express from "express";

import { AddToWallet, getSoldeRequest, getUserByPhone, sendSoldeRequest, sendSoldeToUser } from "../mobileControllers/transaction.js";
import { verifyToken } from "../utils/verifToken.js";
const router = express.Router();

router.post("/addToWallet", AddToWallet);
router.post("/getUserByPhone", verifyToken, getUserByPhone);
router.post("/sendSoldeToUser", verifyToken, sendSoldeToUser);
router.post("/sendSoldeRequest", verifyToken, sendSoldeRequest);
router.post("/getSoldeRequest", verifyToken, getSoldeRequest);



export { router as mobTransanctionRouter };
