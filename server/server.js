import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Auth from "./routes/RegisterRoute.js";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/adminRoute.js";
import FavoriteRoute from "./routes/favoriteRoute.js";
import WishlistRoute from "./routes/wishlistRoute.js";
import searchRoute from "./routes/searchRoute.js";
import addressRoute from "./routes/addressRoute.js";

// Config
// dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));

// Routes
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", Auth);
app.use("/admin", adminRoute);
app.use("/", FavoriteRoute);
app.use("/getSearch", searchRoute);
app.use("/books", WishlistRoute);
app.use("/address",addressRoute)
app.get("/", (req, res) => {
    res.send("Welcome to Library backend.");
});

// Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
