import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required:true,
    },
    address:{
        type: String,
        required:true,
    },
    phone: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    email:{
        type: String,
        required: true,
    }
})


export default mongoose.model("User", ProfileSchema);