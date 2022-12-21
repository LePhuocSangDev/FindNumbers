import { loginUser, logout, registerUser } from "../controller/auth";

const router = require("express").Router();


//REGISTER
router.post("/register", registerUser);

//LOGIN

router.post("/login", loginUser);

//Log out

router.get("/logout", logout);

export default router;
