import express from "express";
import { upload } from "../utils/multer.js";
import {
    buyPack,
    createProduct,
    getAllProducts,
    getEndedProducts,
    getInProgressProducts,
    getProductById,
    getProducts
} from "../controllers/product.js";
import { verifyToken } from "../utils/verifToken.js";
const router = express.Router();

router.post("/createProduct", upload.array("files"), createProduct);
router.get("/getProducts/:cid", getProducts);
router.get("/getAllProds", getAllProducts);
router.get("/getInProgressProducts/:cid", getInProgressProducts);
router.get("/getEndedProducts/:cid", getEndedProducts);
router.post("/getProductById", verifyToken, getProductById);
router.post("/buyPack", verifyToken, buyPack);
export { router as productRouter };
