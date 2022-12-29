import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";
import authRouter from "./routes/auth";
import Message from "./models/Message";
import Room from "./models/Room";
const cloudinary = require("cloudinary");

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log(err);
  });

mongoose.set("strictQuery", false);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let readyPlayers = [];

io.on("connection", (socket: Socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("create_room", (room) => {
    // Create the room in the database
    Room.create(room, (error: Error, newRoom: string) => {
      if (error) {
        console.error(error);
      } else {
        // Broadcast a message to all clients to update the list of rooms
        io.emit("update_rooms", newRoom);
        console.log(newRoom);
      }
    });
  });

  socket.on("join_room", async (gameRoom) => {
    readyPlayers = [];
    const previousMessages = await Message.find({ room: gameRoom.name })
      .sort({ timestamp: 1 })
      .exec();
    io.in(gameRoom.name).emit("update_messages", previousMessages);
    const foundRoom: any = await Room.findOne({ name: gameRoom.name });
    if (foundRoom) {
      if (foundRoom.available) {
        foundRoom?.players.push(socket.id);
        socket.join(gameRoom.name);
        console.log(`User with ID: ${socket.id} joined room: ${gameRoom.name}`);
        io.in(gameRoom.name).emit("user_joined", {
          userId: socket.id,
          player: gameRoom.player,
        });
      } else {
        socket.emit("error", "Room full");
      }

      if (foundRoom.players.length >= 2) {
        foundRoom.available = false;
      }

      await foundRoom.save((error: Error) => {
        if (error) {
          console.error(error);
        }
      });
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("leave_room", async (roomName) => {
    readyPlayers = [];
    // Leave the room

    // Find the room in the database
    const foundRoom: any = await Room.findOne({ name: roomName });
    if (foundRoom) {
      socket.leave(roomName);
      console.log(`User with ID: ${socket.id} left room: ${roomName}`);
      socket.broadcast.to(roomName).emit("user_left", {
        userId: socket.id,
        message: "Your opponent has left the room",
      });
      // Remove the user's socket ID from the list of players in the room
      const index = foundRoom.players.indexOf(socket.id);
      if (index > -1) {
        foundRoom.players.splice(index, 1);
      }

      // Update the room's availability
      foundRoom.available = true;

      if (foundRoom.players.length === 0) {
        // Set a timer to delete the room if no one is in it after 10 minutes
        const timer = setTimeout(() => {
          Room.deleteOne({ _id: foundRoom._id }, (error) => {
            if (error) {
              console.error(error);
            } else {
              // Broadcast a message to all clients to update the list of rooms
              io.emit("update_rooms", foundRoom);
            }
          });
          Message.deleteOne({ room: foundRoom.name }, (error) => {
            if (error) {
              console.log(error);
            }
          });
          console.log("clear");
        }, 1000 * 60 * 5);

        // Cancel the timer if another user joins the room before the timeout expires
        socket.on("join_room", () => {
          clearTimeout(timer);
        });
      }
      await foundRoom.save((error: Error) => {
        if (error) {
          console.error(error);
        } else {
          // Broadcast a message to all clients to update the list of rooms
          io.emit("update_rooms", foundRoom);
        }
      });
    }
  });

  socket.on("get_rooms", () => {
    // Find available rooms in the database
    Room.find({ available: true }, (error: Error, rooms: any) => {
      if (error) {
        console.error(error);
      } else {
        // Send the list of rooms back to the client
        socket.emit("update_rooms", rooms);
      }
    });
  });

  socket.on(
    "send_message",
    async (data: { room: string; message: string; author: string }) => {
      const newMessage = new Message({
        room: data.room,
        message: data.message,
        author: data.author,
        timestamp: new Date(),
      });
      await newMessage.save();
      socket.to(data.room).emit("receive_message", data);
    }
  );
  socket.on(
    "send_gameData",
    (data: {
      chosenNumber: number;
      room: string;
      points: number;
      player: string;
    }) => {
      socket.to(data.room).emit("receive_gameData", data);
    }
  );
  socket.on("game_over", (data) => {
    socket.to(data.room).emit("end_game", data);
  });
  socket.on("ready", (gameRoom) => {
    readyPlayers.push(gameRoom.name);
    socket.to(gameRoom.roomName).emit("playerReady", {
      name: gameRoom.name,
      numberOfReady: readyPlayers.length,
    });
    console.log(readyPlayers.length);
    if (readyPlayers.length === 2) {
      socket.to(gameRoom.roomName).emit("game_start");
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.rooms);
    console.log("User Disconnected", socket.id);
  });
});