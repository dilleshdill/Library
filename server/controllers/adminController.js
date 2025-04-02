import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";
import Library from "../models/libraryModel.js";
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

    // Find admin by email
    const admin = await adminModel.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Find the library that this admin manages
    const library = await Library.findOne({ admin: admin._id });

    if (!library) {
      return res.status(403).json({ message: "No library assigned to this admin" });
    }

    // Generate JWT token (attach library ID)
    const token = jwt.sign({ adminId: admin._id, libraryId: library._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      admin: { _id: admin._id, name: admin.name, email: admin.email },
      library: { _id: library._id, name: library.name, address: library.address },
      token, // Return token with library ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await adminModel.create({ username, email, password: hashedPassword });

    const token = generateUserToken(newUser);
    res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export { addAdmin, adminLogin };
