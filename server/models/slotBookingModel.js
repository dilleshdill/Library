import mongoose from "mongoose";

const SlotBookingSchema = new mongoose .Schema({
    libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
    dimension: [{
        floor: { type: Number, required: true },
        grids: [{
            rows: { type: Number, required: true },
            cols: { type: Number, required: true }
        }]
    }],
    selected: [{ 
        floor: { type: Number, required: true },
        grid: { type: Number, required: true },
        index: { type: Number, required: true } 
    }]
})

const SlotBookingModel = new mongoose.model("slotBooking",SlotBookingSchema);

export default SlotBookingModel;

