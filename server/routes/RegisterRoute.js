import express from "express";
import { addUser,userLogin } from "../controllers/authController.js";

const Auth = express.Router();

// Register Route
Auth.post("/signup", addUser);
Auth.post("/login", userLogin);

export default Auth;