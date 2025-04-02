import express from "express";
import { addUser,userLogin ,getUserDetails,getUserId,RegisterSlot} from "../controllers/authController.js";

const Auth = express.Router();

// Register Route
Auth.post("/signup", addUser);
Auth.post("/login", userLogin);
Auth.post('/userid',getUserId)
Auth.get('/:_id',getUserDetails)
Auth.post('/reserve-book',RegisterSlot)
// Auth.post('/getRemoveList',RemoveList)

export default Auth;