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

  Use React / Next.js / Vue ONLY if explicitly requested.

  Rules:
  - Responsive
  - Modern UI
  - CSS Variables
  - Flexbox/Grid
  - Smooth Scroll
  - Hover Effects
  - Beautiful spacing
  - Single page unless user asks for different.
  - Keep the implementation concise.

  ==================IMAGES=====================
  - Use real Unsplash image URLs only when images are needed.

  ==============================================
OUTPUT LIMIT:
- Keep the entire response under approximately 3000 tokens.
- Keep HTML, CSS and JavaScript concise.
- Avoid comments.
- Avoid repeated styles.
- Avoid unnecessary sections.
- Use at most 3 images.
- Do not generate large dummy datasets.

- The JSON must always be complete and syntactically valid.

  Return ONLY compact, valid JSON. No markdown fences.
  Schema:
  {
    "files": [
      {
        "name": "index.html",
        "content": ""
      },
      {
        "name": "style.css",
        "content": ""
      },
      {
        "name": "script.js",
        "content": ""
      }
    ]
  }

  IMPORTANT:
  - The response must be complete.
  - Never stop in the middle of a file.
  - Escape all double quotes inside source-code strings.
  - Escape backslashes correctly inside JSON strings.
  - Use \\n for new lines inside JSON strings.
  - Do not return markdown fences.
  - Do not return explanations.
  - End with the final }.

  User request:
  ${state.prompt}
`;
    const res = await llm.invoke(prompt);
    console.log(res.content);

    try {
      const data = JSON.parse(res.content);

      return {
        ...state,
        aiResponse: "Code generated successfully.",
        artifacts: [
          {
            id: Date.now(),
            type: "Project",
            title: state.prompt,
            files: data.files || [],
          },
        ],
      };
    } catch (error) {
      console.error("Invalid/incomplete code JSON:", error.message);
      throw new Error("Code generation was incomplete. Please try again.");
    }
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
