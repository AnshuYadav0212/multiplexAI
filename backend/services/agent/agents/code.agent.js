import { getModel } from "../config/llmModels.js";

export const codeAgent = async (state) => {
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
  if (intent == "CODE_GENERATION") console.log(intent);
};
