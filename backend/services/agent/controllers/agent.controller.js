import axios from "axios";
import { graph } from "../graph/graph.js";
import dotenv from "dotenv";
export const agent = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { prompt } = req.body;
    await axios.post(
      `${process.env.CHAT_SERVICE_URL}/message/:conversationId`,
      {
        conversationId,
        role: "user",
        content: prompt,
      },
    );
    const result = await graph.invoke({
      prompt,
      conversationId,
    });
    const response = result.aiResponse;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: `agent error ${error}` });
  }
};
