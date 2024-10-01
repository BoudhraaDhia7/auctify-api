import express from "express";
import {
  amountByProduct,
  getProductsParticipatedByUser, participationInfosByUserId,
  registerForProduct,

} from "../controllers/participant.js";
import { verifyToken } from "../utils/verifToken.js";
const router = express.Router();
router.post("/registerForProduct", registerForProduct);
router.get("/getProductsParticipatedByUser/:id", getProductsParticipatedByUser);
router.get("/amountByProductId", amountByProduct);
router.get("/participationInfos/:id", participationInfosByUserId);
export { router as participantRouter };
