import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
dotenv.config();

const port = 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log(err);
  });

mongoose.set('strictQuery', false)
io.on("connection", (socket: any) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data: number) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data:{room: string}) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});