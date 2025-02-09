import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

dotenv.config();

const CMAP_URL = "./node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const ProfileSchema = z.object({
  fname: z.string().or(z.literal("Not Found")),
  lname: z.string().or(z.literal("Not Found")),
  education: z.array(z.string()).or(z.literal("Not Found")),
  skills: z.array(z.string()).or(z.literal("Not Found")),
  experience: z.array(z.string()).or(z.literal("Not Found")),
  phone: z.string().or(z.literal("Not Found")),
  dob: z.string().or(z.literal("Not Found")),
});


/**
 * Reads and extracts text from a PDF file.
 * @param {string} filePath - Path to the PDF file (e.g., "./uploads/sample.pdf").
 * @returns {Promise<string>} Extracted text from the PDF.
 */
const readPdf = async (filePath) => {
  if (!filePath) {
    console.error("Error: filePath is undefined");
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.error("Error: File does not exist at path", filePath);
    return;
  }

  console.log("Reading PDF:", filePath);
  
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = getDocument({ data, cMapUrl: CMAP_URL, cMapPacked: CMAP_PACKED });

  try {
    const pdfDocument = await loadingTask.promise;
    if (!pdfDocument) {
      console.error("Failed to load PDF document.");
      return;
    }

    console.log("# PDF document loaded. Total pages:", pdfDocument.numPages);

    const pagesText = await Promise.all(
      Array.from({ length: pdfDocument.numPages }, async (_, i) => {
        const page = await pdfDocument.getPage(i + 1);
        const textContent = await page.getTextContent();
        return textContent.items.map((item) => item.str).join(" ");
      })
    );

    return pagesText.join(" ");
  } catch (error) {
    console.error("Error reading PDF:", error);
  }
};

/**
 * Extracts resume details using OpenAI.
 * @param {string} filePath - Path to the PDF file.
 */
const extractResumeData = async (filePath) => {
  console.log("Extracting Resume Data...");
  try {
    const extractedText = await readPdf(filePath);
    if (!extractedText) {
      console.error("No text extracted from PDF.");
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that extracts structured resume details and returns them in JSON format." },
        {
          role: "user",
          content: `Extract the following details from the resume text:
          - First Name
          - Last Name
          - Education
          - Skills
          - Experience
          - Phone Number
          - Date of Birth (DOB)

          If any field is missing, return 'Not Found' for that field.
          
          Resume Text: """${extractedText}"""`,
        },
      ],
      response_format: zodResponseFormat(ProfileSchema, "resumeData"),
    });

    const resumeData = completion.choices[0].message.content;
    const parsedData = JSON.parse(resumeData); // Ensure it's properly parsed
    console.log("Extracted Resume Data (JSON):\n", parsedData);
    
    // return ResumeSchema.parse(parsedData); // Validate with Zod
  } catch (error) {
    console.error("Error extracting resume data:", error);
  }
};

// Run the function
extractResumeData("./uploads/1739027030127-Samriddhi.pdf");
