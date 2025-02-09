    import express from 'express';
    import { uploadPDFusingEmail, getPDFsById, deletePDF, getPDFsByEmployeeId, getPDFByEmail, populateDataByResume } from '../controllers/PdfDetailController.js';
    import { upload } from '../middleware/uploadMiddleware.js';
    // import multer from 'multer';

    const getPDFrouter = express.Router();

    getPDFrouter.post('/create/:email', upload.single('file'), uploadPDFusingEmail);
    getPDFrouter.get('/getById/:id', getPDFsById);
    getPDFrouter.get('/getPDFsByEmployeeId/:id', getPDFsByEmployeeId);
    getPDFrouter.delete('/deletePdf/:id', deletePDF);
    // getPDFrouter.get('/extract', upload.single('file'), extractResumeData);
    getPDFrouter.get('/get-pdf/:email', getPDFByEmail);
    getPDFrouter.get('/populate_data_by_resume/:email', populateDataByResume);
    export default getPDFrouter;
