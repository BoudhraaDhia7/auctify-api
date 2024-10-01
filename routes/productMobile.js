import express from "express";
import { upload } from "../utils/multer.js";
import { createProduct, getAuctionById, getEndedProducts, getFavProduct, getInProgressProducts, getParticipatedProducts, getProducts, setFavProduct } from "../mobileControllers/product.js";
import { verifyToken } from "../utils/verifToken.js";
const router = express.Router();

router.post("/createProduct", upload.array("files"), createProduct);

router.post("/getProducts", getProducts);
router.post("/getInProgressProducts", getInProgressProducts);
router.post("/getEndedProducts", getEndedProducts);

router.post("/getParticipatedProducts", verifyToken, getParticipatedProducts);

router.post("/setFavProduct", verifyToken, setFavProduct);
router.post("/getFavProduct", verifyToken, getFavProduct);

router.post("/getAuctionById", verifyToken, getAuctionById);



export { router as productMobileRouter };
