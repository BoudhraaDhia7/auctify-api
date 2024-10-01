import express from "express";
import {
  companiesList,
  usersList,
  totalUsers,
  totalSolde,
  totalParticipants,
  totalCompanies,
  totalProds,
  totalProdsSolde,
  ProdsByCompanyId,
  totalProdsByCompanyId,
  productsParticipationByCompanyId,
  getTotalProductParticipatedByCompanyId,
  searchUsersByName,
  searchCompaniesByName,
  searchProductsByName,
  totalProductsSoldePerMonth,
  totalSoldeParticipationPerMonth,
  totalAmountByCompany,
  topParticipant,
  lastAddedProducts, getParticipationCount, companyRapport, productRapport, usersRapport, acceptCompanyRequest,
} from "../controllers/AdminController.js";

import { createNote, getNotesByUserId } from "../controllers/Notes.js";
import { getInfosByCompanyId } from "../controllers/Company.js";

const router = express.Router();

router.get("/companiesList", companiesList);
router.get("/usersList", usersList);
router.get("/totalUsers", totalUsers);
router.get("/totalProds", totalProds);
router.get("/totalProdsSolde", totalProdsSolde);
router.get("/totalCompanies", totalCompanies);
router.get("/totalSolde", totalSolde);
router.get("/totalParticipant", totalParticipants);
router.post("/createNote/:id", createNote);
router.get("/getNotesByUserId/:id", getNotesByUserId);
router.get("/getInfosByCompanyId/:id", getInfosByCompanyId);
router.get("/ProdsByCompanyId/:id", ProdsByCompanyId);
router.get("/totalProdsByCompanyId/:id", totalProdsByCompanyId);
router.get("/productsParticipationByCompanyId/:companyId", productsParticipationByCompanyId);
router.get("/getTotalProductParticipatedByCompanyId/:id", getTotalProductParticipatedByCompanyId);
router.post("/searchUsersByName", searchUsersByName);
router.post("/searchCompaniesByName", searchCompaniesByName);
router.post("/searchProductsByName", searchProductsByName);
router.get("/totalProductsSoldePerMonth", totalProductsSoldePerMonth);
router.get("/totalSoldeParticipationPerMonth", totalSoldeParticipationPerMonth);
router.get("/totalAmountByCompany", totalAmountByCompany);
router.get("/topParticipant", topParticipant);
router.get("/lastAddedProducts", lastAddedProducts);
router.post("/getParticipationCount", getParticipationCount);

router.patch("/acceptCompanyRequest/:companyId", acceptCompanyRequest);
router.post("/companyRapport", companyRapport);
router.post("/productRapport", productRapport);
router.post("/usersRapport", usersRapport);

export { router as adminRouter };
