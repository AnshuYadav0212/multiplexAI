import { moveDown, PDFDocument } from "pdfkit";

const generatePdf = async (data) => {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Author: "MultiplexAI",
        Title: data.title,
        Creator: "MultiplexAI",
      },
    });
    const chunks = [];
    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", () => reject);

    //title inserted
    document
      .fontSize(28)
      .text(data.title, { align: "center" })
      .fillColor("#151345");

    if (data.subtitle) {
      document.moveDown(0.5);
    }

    // subtitle inserted
    document
      .fontSize(12)
      .text(data.subtitle, { align: "center" })
      .fillColor("#723722");

    document.moveDown(2);
    // sections insertion

    data;
  });
};
