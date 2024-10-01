import express from "express";
import {
    registerCompany,
    loginCompany,
    getProductByCompanyId,
    resetPasswordCompany,
    getCurrentConnectedUserInfos,
    forgotPassword,
    updatedCompanyProfile,
    updatePasswordCompany,
    updateEmailCompany,
    getInProgressCompanyProducts,
    restrictCompany, unRestrictCompany
} from "../controllers/Company.js";
import { upload } from "../utils/multer.js";
const router = express.Router();

router.post(
  "/registerCompany",
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "commerceRegister",
      maxCount: 1,
    },
  ]),
  registerCompany
);
router.post("/loginCompany", loginCompany);
router.get("/getProductByCompanyId/:id", getProductByCompanyId);
router.post("/resetPassword", resetPasswordCompany);
router.patch(
  "/updateProfileCompany/:id",
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "commerceRegister",
      maxCount: 1,
    },
  ]),
    updatedCompanyProfile
);

router.get("/getCurrentConnectedUserInfos/:id", getCurrentConnectedUserInfos);
router.post("/forgotPassword", forgotPassword);
router.put("/updatePassword/:id", updatePasswordCompany);
router.put("/updateEmailCompany/:id", updateEmailCompany);
router.get("/getInProgressCompanyProducts/:companyId", getInProgressCompanyProducts);
router.patch("/restrictCompany/:companyId", restrictCompany);
router.patch("/unRestrictCompany/:companyId", unRestrictCompany);

export { router as companyRouter };
