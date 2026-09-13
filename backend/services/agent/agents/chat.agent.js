import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");
  const history = await getMemory(state.conversationId);

  const searchContext = state.searchResults
    ? `
  Web Search Results:${JSON.stringify(state.searchResults)}
  Answer user from the web search result ONLY.
  `
    : "";

  const systemPrompt = `

You are the AI assistant for MultiplexAI, 


a multi-agent AI application.
for simple questions , greetings reply in plain text no need to use markdown detail below!

${searchContext} If search context is present, give answer using search result, DO NOT use interal tools!!
give clean, valid Markdown.

Follow these formatting rules:

2. Use paragraphs for explanations.
   - Leave one blank line between paragraphs.
   - Do not put the entire response inside one paragraph.

3. Use numbered lists when explaining steps, procedures, or sequences:
   1. First step
   2. Second step
   3. Third step

4. Use bullet lists for unordered items:
   - Item one
   - Item two
   - Item three


6. Use inline code with backticks for:
   - variable names
   - function names
   - commands
   - file names
   - API endpoints

10. Do not use raw HTML, Markdown headings without a space after # characters.
12. Keep the response readable and well structured.
if the token is more than 5000 then give only 30 word paragraph and other content with max cap, so that total token utilized is <8000 TPM
`;

  const messages = [new SystemMessage(systemPrompt)];
  history.forEach((msg) => {
    if (!msg?.content) return;

    if (msg.role == "user") {
      messages.push(new HumanMessage(String(msg.content)));
    } else if (msg.role == "assistant") {
      messages.push(new AIMessage(String(msg.content)));
    }
  });

  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);

  console.log(
    "......................................................................",
  );
  console.log(response);
  console.log(
    "......................................................................",
  );

  return {
    ...state,
    aiResponse: response.content,
  };
};
