import { RequestHandler } from "express";
import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const cloudinary = require("cloudinary");
const fs = require("fs");

interface User {
  username: string;
  email: string;
  password: string;
  picture: string;
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const user: any = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(401).json({ message: "Username does not exist" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordValid) {
    res.status(401).json({ message: "Wrong password!" });
    return;
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SEC || "", {
    expiresIn: "3d",
  });
  const { password, ...others } = user._doc;
  res.status(200).json({ ...others, accessToken });
};

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.picture, {
      folder: "avatars",
    });
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      res.status(401).json("User already exists");
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        picture: myCloud.secure_url,
      });

      const savedUser: any = await newUser.save();

      const { password, ...others } = savedUser._doc;
      res.status(201).json(others);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    res.status(200).json("You are logged out!");
  } catch (error) {
    res.status(500).json(error);
  }
};
