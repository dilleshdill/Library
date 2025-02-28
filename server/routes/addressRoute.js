import {addAddress,getAddress,removeAddress,editAddress} from "../controllers/addressController.js";
import express from "express";

const addressRoute = express.Router()

addressRoute.post("/",addAddress)
addressRoute.get("/",getAddress)
addressRoute.post("/remove",removeAddress)
addressRoute.post("/edit",editAddress)
export default addressRoute;