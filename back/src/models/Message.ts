import mongoose, { Model } from "mongoose";
interface Message {
  room: string;
  message: string;
  author: string;
  timestamp: Date;
}
const Message = new mongoose.Schema<Message>({
  room: String,
  message: String,
  author: String,
  timestamp: Date,
});
export default mongoose.model<Message>("Message", Message);
