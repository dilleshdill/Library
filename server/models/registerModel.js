import mongoose from "mongoose";

const userRegisterSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const userRegisterModel = mongoose.models.userRegisterModel || mongoose.model("Register", userRegisterSchema);

export default userRegisterModel;
