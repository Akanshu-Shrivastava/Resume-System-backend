// utils/generateResumePDF.js
import fs from "fs-extra";
import path from "path";
import handlebars from "handlebars";
import puppeteer from "puppeteer";

export const generateResumePDF = async (resumeData) => {
  try {
    // 1. Load the HTML and CSS template files
    const htmlPath = path.join(process.cwd(), "templates", "template1.html");
    const cssPath = path.join(process.cwd(), "templates", "template1.css");

    const htmlTemplate = await fs.readFile(htmlPath, "utf-8");
    const cssTemplate = await fs.readFile(cssPath, "utf-8");

    // 2. Combine CSS inside <style> tag for Puppeteer to render it inline
    const fullHTML = `
      <html>
        <head>
          <style>${cssTemplate}</style>
        </head>
        <body>
          ${handlebars.compile(htmlTemplate)(resumeData)}
        </body>
      </html>
    `;

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    // 4. Set HTML content
    await page.setContent(fullHTML, { waitUntil: "networkidle0" });

    // 5. Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm" }
    });

    await browser.close();

    return pdfBuffer;

  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};
