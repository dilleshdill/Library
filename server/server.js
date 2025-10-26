// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import setUpSocket from "./socket/index.js";
import crypto from "crypto";
import cookieParser from "cookie-parser";

// Import Models
import FavoriteModel from "./models/favoriteModel.js";
import OrdersModel from "./models/ordersModel.js";

// Import Routes
import Auth from "./routes/RegisterRoute.js";
import adminRoute from "./routes/adminRoute.js";
import FavoriteRoute from "./routes/favoriteRoute.js";
import WishlistRoute from "./routes/wishlistRoute.js";
import searchRoute from "./routes/searchRoute.js";
import addressRoute from "./routes/addressRoute.js";
import chatRouter from "./routes/ChatRoutes.js";
import messageRouter from "./routes/MessageRoute.js";
import OrdersRoute from "./routes/ordersRoute.js";
import LibraryRoute from "./routes/libraryRoute.js";
import slotBookingRoute from "./routes/slotBookingRoute.js";

// Config
dotenv.config();

const app = express();

// CORS Setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174",process.env.FRONTEND_DOMAIN],
    credentials: true,
  })
);

// Socket Setup
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174",process.env.FRONTEND_DOMAIN],
    credentials: true,
  },
});
setUpSocket(io);

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", Auth);
app.use("/admin", adminRoute);
app.use("/", FavoriteRoute);
app.use("/getSearch", searchRoute);
app.use("/books", WishlistRoute);
app.use("/address", addressRoute);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/orders", OrdersRoute);
app.use("/library",LibraryRoute)
app.use("/slotbooking",slotBookingRoute);
// Clear Favorites
// app.post("/favorite/clear", async (req, res) => {
//   const { email } = req.body;
//   try {
//     if (!email) throw new Error("Email is required");

//     const updated = await FavoriteModel.findOneAndUpdate(
//       { email },
//       { $set: { favorites: [] } },
//       { new: true }
//     );

//     if (!updated) throw new Error("User not found");
//     res.status(200).send("Favorites cleared successfully");
//   } catch (error) {
//     console.error("Error clearing favorites:", error.message);
//     res.status(500).send(`Internal server error: ${error.message}`);
//   }
// });

// Add Orders
// app.post("/orders/add", async (req, res) => {
//   const { email, orders } = req.body;
//   try {
//     if (!email || !orders || !orders.length) {
//       throw new Error("Invalid email or empty orders");
//     }

//     const updatedOrder = await OrdersModel.findOneAndUpdate(
//       { email },
//       { $push: { orders: { $each: orders } } },
//       { upsert: true, new: true }
//     );

//     if (!updatedOrder) throw new Error("Order update failed");
//     res.status(200).send("Orders added successfully");
//   } catch (error) {
//     console.error("Error adding orders:", error.message);
//     res.status(500).send(`Internal server error: ${error.message}`);
//   }
// });

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    if (!amount || !currency || !receipt) {
      return res.status(400).send("Missing payment parameters");
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    res.status(500).send("Payment creation failed");
  }
});

// Verify Razorpay Payment
app.post("/api/payment/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send("Missing parameters");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ status: "Payment verified" });
    } else {
      return res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    return res.status(500).send("Server error");
  }
});

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to Library backend.");
});

// Server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
