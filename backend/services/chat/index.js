import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./config/db.js";
import router from "./routes/chat.routes.js";
dotenv.config();

const port = process.env.CHAT_SERVICE_PORT;

const app = express();
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "hello from Chat " });
});

app.listen(port, () => {
  console.log(`Chat service is running on port ${port}`);
  connectToDatabase();
});
