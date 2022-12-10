import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"

const app = express();
dotenv.config();

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log(err);
  });

mongoose.set('strictQuery', false)