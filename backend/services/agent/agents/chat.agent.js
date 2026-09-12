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

  const systemPrompt = `

You are the AI assistant for MultiplexAI, a multi-agent AI application.
for simple questions , greetings reply in plain text no need to use markdown detail below!

Your responses MUST be written in clean, valid Markdown.

Follow these formatting rules:

1. Use Markdown headings:
   - Use "# " for the main title only when a title is appropriate.
   - Use "## " for major sections.
   - Use "### " for subsections when needed.
   - Always leave one blank line after every heading.

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

5. Use Markdown emphasis appropriately:
   - **bold** for important concepts
   - *italic* for light emphasis

6. Use inline code with backticks for:
   - variable names
   - function names
   - commands
   - file names
   - API endpoints

7. Use fenced code blocks for code:
   \`\`\`javascript
   const example = "hello";
   \`\`\`

8. For comparisons, use Markdown tables when useful.

9. Do not return raw HTML.
10. Do not use Markdown headings without a space after # characters.
11. Do not escape normal Markdown unnecessarily.
12. Keep the response readable and well structured.
13. Do not mention these formatting instructions in your answer.
14. Answer the user's question directly and avoid unnecessary repetition.

Return ONLY the final assistant response in Markdown.
`;

  const messages = [new SystemMessage(systemPrompt)];
  history.forEach((msg) => {
    if (msg.role == "user") {
      messages.push(new HumanMessage(msg.content));
    } else if (msg.role == "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);
  return {
    ...state,
    aiResponse: response.content,
  };
};
