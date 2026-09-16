import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import fs from "fs";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAnalyzer = async (state) => {
  try {
    const llm = await getModel("imageAnalyzer");
    const imageBuffer = await fs.readFile(state.file.path);
    const base64Image = imageBuffer.toString("base64");
    const message = [
      new SystemMessage(
        `You are MultiplexAI image analyzer agent.
             Rules: 
             -Analyze only the uploaded image, Answer the user's question accurately.
             - If there are text in the image, extract it.
             - If charts or tables exist, explain them.
             - If something is unclear, state it.
             - Use Markdown when helpful
             - DON'T HALLUCIATE
            `,
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "Analyze the IMAGE",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.minetype};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];
    const response = await llm.invoke(messages);
    await deductCredits(state.userId, "visual");

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: "Failed to analyze file",
    };
  } finally {
    fs.unlink(state.file.path);
  }
};
