import userRegisterModel from "../models/registerModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateUserToken from "../utils/user.util.js";

dotenv.config();



// Register New User
const addUser = async (req, res) => {
    try {
        const { username,email, password } = req.body;

        // Check if user exists
        const existingUser = await userRegisterModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create New User
        const newUser = await userRegisterModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate JWT Token
        const token = generateUserToken(res,newUser)
        console.log(token)
        res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};
const userLogin = async (req, res) => {
    try {
        const {email, password } = req.body;
        if (!email || !password){

        }
        const existingUser = await userRegisterModel.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, existingUser.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        // Generate JWT token
        const token = generateUserToken(res,existingUser)
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Login error", error });
    }
};

const getuserDetails = async (req, res) => {
    try {
        const userId = req.params._id; // Extract user ID from route params
        const user = await userRegisterModel.findById(userId); // Fetch user from database

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};
const getId =async (req,res)=>{
    const { email } = req.body;

  try {
    const user = await userRegisterModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send structured JSON response
    res.status(200).json({ id: user._id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { addUser, userLogin,getuserDetails,getId };

