import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./config/db.js";
dotenv.config();

const port = process.env.AGENT_SERVICE_PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "hello from Agent service " });
});

app.listen(port, () => {
  console.log(`Agent service is running on port ${port}`);
  connectToDatabase();
});
