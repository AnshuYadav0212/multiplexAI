import express from "express";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.API_GATEWAY_PORT;

const app = express();
app.get("/", (req, res) => {
  res.json({ message: "API Gateway is send  running" });
});
app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
