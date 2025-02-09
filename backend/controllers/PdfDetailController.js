import PdfDetail from '../models/PdfDetailsModel.js';
import path from 'path';
import fs from 'fs';
import OpenAI from "openai";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";

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


export const createPDF = async (req, res) => {
    try {
        const { employeeId, employeeName, date } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "PDF file is required" });
        }

        const newPdfDetail = new PdfDetail({
            EmplyeeId: employeeId,
            EmplyeeName: employeeName,
            date,
            pdf: req.file,
        });

        await newPdfDetail.save();
        res.status(201).json({ message: "Resume uploaded successfully", data: newPdfDetail });
    } catch (error) {
        res.status(500).json({ message: "Error uploading resume", error: error.message });
    }
};

export const getPDFsById = async (req, res) => {
    try {
        const id = req.params.id;
        const dbResponse = await PdfDetail.findById(id);

        if (!dbResponse) {
            return res.status(404).json({ message: "No resume found for this employee" });
        }

        const filePath = dbResponse.pdf.path;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" });
        }

        const data = fs.readFileSync(filePath);
        res.contentType("application/pdf");
        res.send(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving resume", error: error.message });
    }
};

export const getPDFsByEmployeeId = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const dbResponse = await PdfDetail.find({ EmplyeeId: employeeId });

        if (!dbResponse.length) {
            return res.status(404).json({ message: "No resumes found for this employee" });
        }

        res.status(200).json({ data: dbResponse });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving resumes", error: error.message });
    }
};

export const deletePDF = async (req, res) => {
    try {
        const { id } = req.params;

        const pdf = await PdfDetail.findById(id);
        if (!pdf) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const filePath = pdf.pdf.path;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await PdfDetail.findByIdAndDelete(id);
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting resume", error: error.message });
    }
};



/**
 * Reads and extracts text from a PDF file.
 * @param {string} filePath - Path to the PDF file.
 * @returns {Promise<string>} Extracted text from the PDF.
 */
const readPdf = async (filePath) => {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }
  
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = getDocument({ data, cMapUrl: CMAP_URL, cMapPacked: CMAP_PACKED });
  
    try {
      const pdfDocument = await loadingTask.promise;
      const pagesText = await Promise.all(
        Array.from({ length: pdfDocument.numPages }, async (_, i) => {
          const page = await pdfDocument.getPage(i + 1);
          const textContent = await page.getTextContent();
          return textContent.items.map((item) => item.str).join(" ");
        })
      );
  
      return pagesText.join(" ");
    } catch (error) {
      throw new Error("Error reading PDF: " + error.message);
    }
  };
  
  /**
   * Extracts structured resume data using OpenAI.
   * @param {string} filePath - Path to the uploaded PDF.
   * @returns {Promise<object>} Extracted resume data.
   */
  export const extractResumeData = async (req, res) => {
    try {
      const filePath = req.file.path; // File path from multer
      const extractedText = await readPdf(filePath);
  
      if (!extractedText) {
        return res.status(400).json({ error: "No text extracted from PDF" });
      }
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Extract structured resume details and return them in JSON format." },
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
  
      const resumeData = JSON.parse(completion.choices[0].message.content);
      res.status(200).json(resumeData);
    } catch (error) {
      console.error("Error extracting resume data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };