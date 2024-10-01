import express from "express";
import {winner, winners} from "../controllers/Winner.js";
const router = express.Router();

router.post("/winner", winner);
router.get("/winners", winners);


export { router as winnerRouter };
