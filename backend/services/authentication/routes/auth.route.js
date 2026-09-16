import express from "express";
import {
  deductCredits,
  login,
  logout,
  updateUserPayment,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/plan", updateUserPayment);
router.post("/credit", deductCredits);

export default router;
