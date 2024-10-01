import express from "express";
import { upload } from "../utils/multer.js";
import { verifyToken } from "../utils/verifToken.js";
import { getAuctionById, getAuctionClassment, getAuctionMembers } from "../mobileControllers/auction.js";

const router = express.Router();
/*
router.get("/getAuctionMembers/:id", verifyToken, getAuctionMembers);
router.post("/getAuctionClassment", verifyToken, getAuctionClassment);
*/

router.get("/getAuctionMembers/:id", getAuctionMembers);
router.post("/getAuctionClassment", getAuctionClassment);
router.post("/getAuctionById", getAuctionById);

export { router as MobAuctionRouter };
