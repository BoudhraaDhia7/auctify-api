import express from "express";

import {
    getAllSettings,
    settings,
    userSettings,
    getUserSettings,
    updateSettingValue,
    createCartPacks, getAllPacks, updateSoldePack, deleteSoldePack
} from "../controllers/Settings.js";
import {adminVerifyToken} from "../utils/verifToken.js";

const router = express.Router();

router.post("/newSetting", settings);
router.post("/newUserSetting", userSettings);
router.get("/settings", getAllSettings);
router.get("/getUserSettings/:id",getUserSettings)
router.patch("/updateSettingValue",updateSettingValue)
router.post("/createNewPack",adminVerifyToken,createCartPacks)
router.get("/getAllPacks",getAllPacks)
router.patch("/updateSoldePacks",updateSoldePack)
router.delete("/deleteSoldePack/:id",adminVerifyToken,deleteSoldePack)
export { router as SettingRouter };
