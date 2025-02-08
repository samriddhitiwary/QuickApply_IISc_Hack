import mongoose from "mongoose";

const PdfDetailsSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    employeeName: {
        type: String,
        required: true,
    },
    
    date:{
        type: Date,
        required:true,
    },
    pdf: {
        type:  mongoose.Schema.Types.Mixed, 
        required: true,
    },
});

export default mongoose.model("PdfDetail", PdfDetailsSchema);
