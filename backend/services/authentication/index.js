import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./config/db.js";
dotenv.config();

const port = process.env.AUTHENTICATION_SERVICE_PORT;

const app = express();
app.get("/", (req, res) => {
  res.json({ message: "hello from Authentication " });
});
app.listen(port, () => {
  console.log(`Authentication service is running on port ${port}`);

  connectToDatabase();
});
