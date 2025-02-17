import {addAddress,getAddress,removeAddress} from "../controllers/addressController.js";
import express from "express";

const addressRoute = express.Router()

addressRoute.post("/",addAddress)
addressRoute.get("/",getAddress)
addressRoute.post("/remove",removeAddress)
export default addressRoute;