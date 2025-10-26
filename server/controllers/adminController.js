import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";
import Library from "../models/libraryModel.js";
import userRegisterModel from "../models/registerModel.js";
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

    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Find the library that this admin manages
    const library = await Library.findOne({ admin: admin._id });

    if (!library) {
      return res.status(400).json({ message: "No library assigned to this admin" });
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
    res.status(200).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const getReseravationFromUser = async (req, res) => {
  try {
      const { libraryId } = req.query; // Correct query parameter extraction

      if (!libraryId) {
          return res.status(400).json({ message: "Library ID is required" });
      }

      const reservations = await userRegisterModel.find(
          { "reservedBooks.libraryId": libraryId },
          { username: 1, email: 1, reservedBooks: 1 }
      );


      res.status(200).json(reservations);
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
      const { userId, reservationId } = req.body;

      
      if (!userId || !reservationId) {
          return res.status(400).json({ message: "User ID and Reservation ID are required" });
      }

      // Find the user and remove the specific reservation
      const user = await userRegisterModel.findById({_id:userId});

      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }

      // Filter out the reservation that matches reservationId
      let seatUpdated = false;

      // Update the status of the specific reservation to "Rejected"
      user.reservedBooks.forEach(book => {
          book.reservedAt.forEach(reservation => {
              if (reservation._id.toString() === reservationId) {
                  reservation.status = "Rejected"; // ✅ Update the status
                  seatUpdated = true;
              }
          });
      });
      console.log(user.reservedBooks)

      if (!seatUpdated) {
          return res.status(400).json({ message: "Reservation not found" });
      }
      

      await user.save();
      res.status(200).json({ message: "Reservation removed successfully", user });
  } catch (error) {
      console.error("Error deleting reservation:", error);
      res.status(500).json({ message: "Server error", error });
  }
};

const getAdminDetails = async (req, res) => {
  try{
    const { adminId } = req.params;
    

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const admin = await adminModel.findById(adminId);
    console.log(admin)

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin details found", admin });
  }
  catch (error) {
    console.error("Error finding the details:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

export { addAdmin, adminLogin,getReseravationFromUser,deleteReservation,getAdminDetails };
