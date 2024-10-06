import express from "express";
import { upload } from "../utils/multer.js";
import { verifyToken } from "../utils/verifToken.js";
import { getnotifications, updateNotifStatus } from "../controllers/Notification.js";

const router = express.Router();


router.get("/getNotifications",  getnotifications);
router.post("/updateNotifStatus", verifyToken, updateNotifStatus);



export { router as notificationsRouter };
