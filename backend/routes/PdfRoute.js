    import express from 'express';
    import { createPDF, getPDFsById, deletePDF, getPDFsByEmployeeId, extractResumeData } from '../controllers/PdfDetailController.js';
    import { upload } from '../middleware/uploadMiddleware.js';
    // import multer from 'multer';

    const getPDFrouter = express.Router();

    getPDFrouter.post('/create', upload.single('file'), createPDF);
    getPDFrouter.get('/getById/:id', getPDFsById);
    getPDFrouter.get('/getPDFsByEmployeeId/:id', getPDFsByEmployeeId);
    getPDFrouter.delete('/deletePdf/:id', deletePDF);
    getPDFrouter.get('/extract', upload.single('file'), extractResumeData);

    export default getPDFrouter;
