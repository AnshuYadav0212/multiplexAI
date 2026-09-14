import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { ChatOpenRouter } from "@langchain/openrouter";
dotenv.config();

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
});

const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
});

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return groq;
    case "code":
      return openrouter;
    case "search":
      return groq;

    default:
      return groq;
  }
};
