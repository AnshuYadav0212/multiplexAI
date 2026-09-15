import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controller.js/billing.controller.js";
const router = express.Router();
router.post("/order", createOrder);
router.post("/verify", verifyPayment);
export default router;
