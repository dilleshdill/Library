import express from "express";
import { addUser,userLogin ,getUserDetails,getUserId,RegisterSlot,getUserDetailsByEmail,getUserDetailsById} from "../controllers/authController.js";

const Auth = express.Router();

// Register Route
Auth.post("/signup", addUser);
Auth.post("/login", userLogin);
Auth.get("/getid/:email",getUserDetailsByEmail);
Auth.post('/userid/',getUserId)
Auth.get('/:_id',getUserDetails)
Auth.get('/byid/:id',getUserDetailsById)
Auth.post('/reserve-book',RegisterSlot)
// Auth.post('/getRemoveList',RemoveList)

export default Auth;