import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";

export const pdfRag = async (state) => {
  try {
    const buffer = fs.readFileSync(state.file.path);
    const pdf = new PDFParse({
      data: buffer,
    });
    const result = pdf.getText();
    const text = result.text;
    const spilliter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await spilliter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;
    const store = await vectorStore(docs, collectionName);

    const relevantDocuments = await store.similaritySearch(state.prompt, 7);
    const context = relevantDocuments.map((d) => d.pageContent).join("/n/n");
    const llm = await getModel("pdfRag");
    const messages = [
      new SystemMessage(`
            You are MultiplexAI image analyzer agent.
             Rules: 
             - Analyze only the uploaded pdf, Answer the user's question accurately.
             - never makeup information
             - if answer is not present in the pdf, say: I could not found answer
             - use markdown formatting
             - DON'T HALLUCIATE
            `),
      new HumanMessage(`
                context: ${context}
                Question:${state.prompt}`),
    ];

    const response = llm.invoke(messages);
    await deductCredits(state.userId, "pdf");
    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to analyze pdf",
    };
  } finally {
    fs.unlinkSync(state.file.path);
  }
};
