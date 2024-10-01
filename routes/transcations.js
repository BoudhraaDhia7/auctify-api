import express from "express";
import { transaction, getTransactions } from "../controllers/transaction.js";
const router = express.Router();

router.post("/transaction", transaction);
router.get("/gettransaction", getTransactions);

export { router as transanctionRouter };
