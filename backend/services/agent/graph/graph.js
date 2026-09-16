import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codeAgent } from "../agents/code.agent.js";
import { visualAgent } from "../agents/visual.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";

const workflow = new StateGraph(agentState);
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("code", codeAgent);
workflow.addNode("visual", visualAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("pdfRag", pdfRag);
workflow.addNode("imageAnalyzer", imageAnalyzer);

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chating";
      case "code":
        return "coding";
      case "visual":
        return "visualising";
      case "pdf":
        return "pdfGen";
      case "ppt":
        return "pptGen";
      case "search":
        return "searching";
      case "pdfRag":
        return "pdfRag";
      case "imageAnalyzer":
        return "imageAnalyzer";

      default:
        break;
    }
  },
  {
    chating: "chat",
    coding: "code",
    visualising: "visual",
    pdfGen: "pdf",
    pptGen: "ppt",
    searching: "search",
    pdfRag: "pdfRag",
    imageAnalyzer: "imageAnalyzer",
  },
);

workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("code", "__end__");
workflow.addEdge("visual", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("pdfRag", "__end__");
workflow.addEdge("imageAnalyzer", "__end__");

export const graph = workflow.compile();
