import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log("user id", userId);
    const conversation = await Conversation.create({
      userId: userId,
    });
    return res.status(201).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error to create conversation: ${error}` });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("user id", userId);
    const conversation = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });
    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error to get conversation: ${error}` });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      title,
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error to get conversation: ${error}` });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { role, content } = req.body;
    if (role && content != null && conversationId) {
      const message = await Message.create({
        conversationId,
        content,
        role,
      });
      return res.status(200).json(message);
    } else
      return res
        .status(400)
        .json({ message: "conversationId, role and content are required" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error in saving message: ${error}` });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      conversationId,
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error in getting messages: ${error}` });
  }
};
