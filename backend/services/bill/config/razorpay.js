import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.BILL_RAZORPAY_KEY_ID,
  key_secret: process.env.BILL_RAZORPAY_KEY_SECRET,
});

export default razorpay;
