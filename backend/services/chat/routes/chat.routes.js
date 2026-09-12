import express from "express";
import {
  createConversation,
  saveMessage,
  getMessages,
  updateConversation,
  getConversations,
} from "../controllers/chat.controller.js";

const router = express.Router();
router.post("/conversation", createConversation);
router.get("/conversations", getConversations);
router.patch("/conversation/:conversationId", updateConversation);
router.post("/message/:conversationId", saveMessage);
router.get("/messages/:conversationId", getMessages);

export default router;
