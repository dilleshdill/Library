import express from "express";
import { addUser,userLogin ,getuserDetails,getId} from "../controllers/authController.js";

const Auth = express.Router();

// Register Route
Auth.post("/signup", addUser);
Auth.post("/login", userLogin);
Auth.post('/userid',getId)
Auth.get('/:_id',getuserDetails)

export default Auth;