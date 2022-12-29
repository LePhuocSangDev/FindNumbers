import { loginUser, logout, registerUser } from "../controller/auth";
import express from "express";

const router = express.Router();

//REGISTER
router.post("/register", registerUser);

//LOGIN

router.post("/login", loginUser);

//Log out

router.get("/logout", logout);

export default router;
