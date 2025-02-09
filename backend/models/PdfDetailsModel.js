import mongoose from "mongoose";
import { date } from "zod";

const PdfDetailsSchema = new mongoose.Schema({
       email: {
        type: String,
        
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required:true,
    }
    ,
    pdf: {
        type:  mongoose.Schema.Types.Mixed, 
        required: true,
    },
});

export default mongoose.model("PdfDetail", PdfDetailsSchema);
