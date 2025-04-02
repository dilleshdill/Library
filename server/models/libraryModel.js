import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  timings:{
    startTime:{type:String,required:true},
    endTime:{type:String,required:true},
  },
  location: {
    type: { type: String, enum: ["Point"], required: true },  // GeoJSON type
    coordinates: { type: [Number], required: true },  // [longitude, latitude]
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }

});

// Enable geospatial indexing
librarySchema.index({ location: "2dsphere" });

const Library = mongoose.model("Library", librarySchema);
export default Library;
