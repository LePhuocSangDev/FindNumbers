import mongoose, { Model } from "mongoose";

interface Room {
  name: string;
  mode: string;
  players: string[];
  available: boolean;
}

const Room = new mongoose.Schema<Room>({
  name: { type: String, unique: true },
  mode: String,
  players: Array,
  available: {
    type: Boolean,
    default: true,
  },
});
export default mongoose.model<Room>("Room", Room);
