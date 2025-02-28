import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../models/adminModel.js";

// Generate JWT Token
const generateUserToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await admin.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = generateUserToken(existingUser);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login error", error });
  }
};

// Register New Admin
const addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await admin.create({ username, email, password: hashedPassword });

    const token = generateUserToken(newUser);
    res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export { addAdmin, adminLogin };
