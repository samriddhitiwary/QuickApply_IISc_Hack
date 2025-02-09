// import fs from "fs/promises";
// import { OpenAI } from "openai";
// import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
// import { z } from "zod";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// const ResumeSchema = z.object({
//   optimizedResume: z.string(),
//   analysis: z.object({
//     strengths: z.array(z.string()),
//     weaknesses: z.array(z.string()),
//     missingSkills: z.array(z.string()),
//     formattingIssues: z.array(z.string()),
//     recommendations: z.array(z.string()),
//   }),
// });

// const extractTextFromPDF = async (filePath) => {
//   const data = new Uint8Array(await fs.readFile(filePath));
//   const pdf = await getDocument({ data }).promise;
//   let extractedText = "";

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const textContent = await page.getTextContent();
//     extractedText += textContent.items.map((item) => item.str).join(" ") + "\n";
//   }

//   return extractedText;
// };

// const analyzeResume = async (filePath) => {
//   try {
//     console.log("Extracting Resume Data...");
//     const extractedText = await extractTextFromPDF(filePath);
//     if (!extractedText) throw new Error("Failed to extract text");

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You are an AI that extracts structured resume details and provides optimization suggestions." },
//         {
//           role: "user",
//           content: `Extract detailed resume analysis, highlight missing skills, weaknesses, and provide a better version of the resume.
          
//           Resume Text: """${extractedText}"""`,
//         },
//       ],
//       response_format: "json",
//     });

//     return ResumeSchema.parse(JSON.parse(completion.choices[0].message.content));
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     throw new Error("Failed to analyze resume");
//   }
// };

// // Run function (example)
// analyzeResume("./uploads/1739027030127-Samriddhi.pdf");
