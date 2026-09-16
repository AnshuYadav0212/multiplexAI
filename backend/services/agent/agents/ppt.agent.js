import { getModel } from "../config/llmModels.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { deductCredits } from "../utils/deductCredits.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const prompt = `
        You are very professional PPT desginer.
           Format:
           {
           "title":"...",
           "subtitle":"...",
           "slides":[
           { 
           "title":"",
           "points":[
           "",
           "",
           "",
           ""]
           }]
           
           }
           Rules:
           - generate exactly 6 content slides, with 4-6 explicit bullet points.
           - No markdown, explanation.
           - No code block, return ONLY JSON
           Topic: ${state.prompt}
        `;
    const res = await llm.invoke(prompt);

    console.log(JSON.parse(res.content));
    const data = JSON.parse(res.content);
    await deductCredits(state.userId, "ppt");

    const ppt = await generatePpt(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });
    const fileName = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      fileName,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const downloadUrl = await getFromS3(fileName, 60 * 60 * 24);
    return {
      ...state,
      aiResponse: `# PPT Generated Successfully ***${data.title}***\n\n[Download PPT File](${downloadUrl})\n\nLink expires in 24 hours.`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: "Failed to generate PPT",
    };
  }
};
