import PdfDetail from '../models/PdfDetailsModel.js';
import path from 'path';
import fs from 'fs';

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
