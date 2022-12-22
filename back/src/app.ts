import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server, Socket } from 'socket.io';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const server = app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth', authRouter);

mongoose
  .connect(process.env.MONGO_URL || "",)
  .then(() => console.log('DB Connection Successful!'))
  .catch((err) => {
    console.log(err);
  });

mongoose.set("strictQuery", false);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data: { room: string, message: string }) => {
    socket.to(data.room).emit('receive_message', data);
  });
  socket.on('send_gameData', (data: { chosenNumber: number,room: string, points: number, player: string}) => {
    socket.to(data.room).emit('receive_gameData', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});
