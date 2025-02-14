import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const AdminModel = mongoose.models.AdminModel || mongoose.model("Admin", AdminSchema);

export default AdminModel;
