import mongoose from "mongoose";

const Room = new mongoose.Schema({
  name: { type: String, unique: true },
  mode: String,
  players: Array,
  available: {
    type: Boolean,
    default: true,
  },
});
export default mongoose.model("Room", Room);
