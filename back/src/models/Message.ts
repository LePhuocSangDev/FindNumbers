import mongoose from "mongoose";

const Message = new mongoose.Schema({
    room: String,
    message: String,
    author: String,
    timestamp: Date,  
})
export default mongoose.model("Message", Message)