import {slotBooking,getSlot,getBookingSlot} from "../controllers/slotBookingController.js";
import express from "express"
const slotBookingRoute = express.Router()

slotBookingRoute.post('/',slotBooking);
slotBookingRoute.post('/getslotdetailes',getSlot)
slotBookingRoute.post('/getBookingSlots',getBookingSlot)
export default slotBookingRoute