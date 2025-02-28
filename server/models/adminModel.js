import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{ timestamps: true });

const AdminModel = mongoose.models.AdminModel || mongoose.model("Admin", AdminSchema);

export default AdminModel;
