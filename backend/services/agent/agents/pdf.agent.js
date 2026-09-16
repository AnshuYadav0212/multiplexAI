import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { deductCredits } from "../utils/deductCredits.js";

export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");
    const prompt = `
     You are an elite document writer.
    Write detailed, factual, and informative content directly addressing the topic: "${state.prompt}".

    CRITICAL REQUIREMENTS:
    - Provide ACTUAL facts, history, background, achievements, and details about the topic.
    - DO NOT write guides, meta-instructions, or steps on how to create a document/PDF.
    - Return ONLY a raw valid JSON object (no markdown code blocks, no extra text).

    Return ONLY valid JSON matching this exact structure:
    {
      "title": "Document Title",
      "subtitle": "Document Subtitle",
      "sections": [
        {
          "heading": "Section Title",
          "points": ["Point 1", "Point 2", "Point 3"]
        }
      ]
    }
    Generate 4 to 8 sections. Each section must contain 3 to 6 concise bullet points.
    DO NOT wrap output in markdown explanations.
    Topic: ${state.prompt}
  
  `;
    const res = await llm.invoke(prompt);
    const rawContent = res.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(rawContent);
    await deductCredits(state.userId, "pdf");

    const pdfBuffer = await generatePdf(data);
    const fileName = `pdf-${Date.now()}.pdf`;
    await uploadToS3(fileName, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(fileName, 60 * 24);

    console.log(JSON.parse(res.content));
    console.log(downloadUrl);

    return {
      ...state,
      aiResponse: `# Document Generated Successfully\n\n[Download PDF File](${downloadUrl})\n\nLink expires in 24 hours.`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: "Failed to generate PDF",
    };
  }
};
