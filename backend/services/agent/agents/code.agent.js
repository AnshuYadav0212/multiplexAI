import { getModel } from "../config/llmModels.js";

export const codeAgent = async (state) => {
  const llm = await getModel("code");
  const intentLlm = await getModel("intent");
  const intentResponse = await intentLlm.invoke(`
        You are intent classifier
        Return ONLY one of the below values:
        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        Users Request:
        ${state.prompt}
      `);
  const intent = intentResponse.content;
  if (intent == "CODE_GENERATION") {
    console.log(intent);
    const prompt = `
   Generate the requested project.
   Default stack:
   - HTML
   - CSS
   - JavaScript

   USe React / Next.js / Vue ONLY if explicitly requested.
   Rules:
   - Responsive
   - Modern UI
   - CSS Variables
   - Flexbox/Grid
   - Smooth Scroll
   - Hover Effects
   - Beautiful spacing
   - Single page unless user ask for differnt.
   Return ONLY valid JSON Schema:
   {
     "files":[
        {
          "name": "index.html",
          "content": "  "
        },
          {
          "name": "style.css",
          "content": "  "
        },
          {
          "name": "script.js",
          "content": "  "
        }
     ]
   }
    Rules for output:
    - output must be start and end with {, } respectively.
    - No markdown, explanation, extra text, \ \ \, and  intents.
    User request:  ${state.prompt}
   `;
    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    return {
      ...state,
      aiResponse: "Code generated Successfully.",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files: data.files || [],
          title: state.prompt,
        },
      ],
    };
  }

  const res = await llm.invoke(`
    The users request is ${intent}
       Return Markdown only, not project files.
       Use headings like #Overview, ## Explanation, ## Problems, ## Improvements, ## Best practices, ## Optimised code (if needed).
       user request:
       ${state.prompt}
    `);
  const data = res.content;
  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
};
