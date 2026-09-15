import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./config/db.js";
import router from "./routes/bill.route.js";
dotenv.config();

const port = process.env.BILL_SERVICE_PORT;

const app = express();
app.use(express.json());
app.use("/", router);
app.get("/", (req, res) => {
  res.json({ message: "hello from bill service " });
});

app.listen(port, () => {
  console.log(`Bill service is running on port ${port}`);
  connectToDatabase();
});
