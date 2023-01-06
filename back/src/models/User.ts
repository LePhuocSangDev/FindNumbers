import mongoose, { Model } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  picture: string;
}

const User = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
});
export default mongoose.model<User>("User", User);
