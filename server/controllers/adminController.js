import bcrypt from "bcrypt";
import admin from "../models/adminModel.js";

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);

        // Check if user exists
        const user = await admin.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        

        if (password != user.password) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Success response
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default adminLogin;
