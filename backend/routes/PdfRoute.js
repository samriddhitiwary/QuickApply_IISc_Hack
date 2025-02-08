import express from 'express';
import { createPDF, getPDFsById, deletePDF, getPDFsByEmployeeId } from '../controllers/PdfDetailController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const getPDFrouter = express.Router();

getPDFrouter.post('/create', upload.single('file'), createPDF);
// getPDFrouter.post('/create',  createPDF);
getPDFrouter.get('/getById/:id', getPDFsById);
getPDFrouter.get('/getPDFsByEmployeeId/:id', getPDFsByEmployeeId);
getPDFrouter.delete('/deletePdf/:id', deletePDF);

export default getPDFrouter;
