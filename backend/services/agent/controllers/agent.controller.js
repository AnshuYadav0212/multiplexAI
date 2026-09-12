import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
export const agent = async (req, res) => {
  try {
    const { conversationId, prompt, agent } = req.body;

    await axios.post(
      `${process.env.CHAT_SERVICE_URL}/message/${conversationId}`,
      {
        conversationId,
        role: "user",
        content: prompt.trim(),
      },
    );
    const result = await graph.invoke({
      prompt: prompt.trim(),
      conversationId,
      agent,
    });
    const response = result.aiResponse;
    await addMessage(conversationId, "user", prompt);

    await addMessage(conversationId, "assistant", response);

    await axios.post(
      `${process.env.CHAT_SERVICE_URL}/message/${conversationId}`,
      {
        conversationId,
        role: "assistant",
        content: response,
        images: result.images,
      },
    );

    return res.status(200).json({
      answer: response,
      images: result.images,
    });
  } catch (error) {
    console.error("Agent error:", error);
    console.error("Downstream error:", error.response?.data);

    return res.status(500).json({
      message: `Agent error: ${error.message}`,
    });
  }
};
