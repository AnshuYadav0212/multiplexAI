import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";

export const visualAgent = async (state) => {
  try {
    const llm = await getModel("visual");
    const res = await llm.invoke(`
        you are an elite prompt engineer.
        
        Covert the users request into a highly detailed image generation prompt
        Requirements:
        - Cinematic lighting
        - Professionl composition
        - Ultra realistic
        - Beautiful color palatee
        - Sharp focus
        - 8K quality
        - Photorealistic
        - Depth of field
        - Professional photography
        - Stunning visuals
        Return only the image prompt.
        User Request:
            ${state.prompt}
        `);

    const prompt = res.content.trim();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await deductCredits(state.userId, "visual");

    console.log(imageRes);
    console.log("!!!Successfull in image generation!!!");
    const buffer = Buffer.from(imageRes.data);
    const fileName = `image-${Date.now()}.png`;
    await uploadToS3(fileName, buffer, "image/png");

    const downloadUrl = await getFromS3(fileName, 60 * 24);
    console.log(downloadUrl);

    return {
      ...state,

      aiResponse: `![Generated Image](${downloadUrl})\n\n[Downlaod Image](${downloadUrl})\n\nLink expires in 10 minutes.`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to Generate Image.",
    };
  }
};
