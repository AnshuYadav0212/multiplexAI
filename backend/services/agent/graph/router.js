import { getModel } from "../config/llmModels.js";

export const router = async (state) => {
  const llm = await getModel("router");
  const systemPrompt = `
  You are an agent router.
  Available agents are : 
   -chat
   -code
   -pdf
   -ppt
   -search
   -visual

   Rules: 
   chat: 
   General conversation, 
   explanation,
   learning,
   questions.

   
   Code:
   Gererate code,
   Debug code,
   build projects,
   build architecture,
   draw HLD,
   give the LLD,
   API Desing.

   PDF:
   questions about gereate PDF or document of context.

   PPT:
   questions about generate PPT or document of the context.

      
   Search:
   Current events,
   Recent innovations and developments,
   news,
   latest information and techniques,
   internet lookup.

   Visual:
   Generate image, create image for the given context of the user message.

   Return ONLY ONE word:
   chat
   code
   pdf
   ppt
   search
   visual

   User Query:
   ${state.prompt}
  `;

  const response = await llm.invoke(systemPrompt);
  console.log(response);
  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
