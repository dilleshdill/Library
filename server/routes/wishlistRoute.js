import express from "express";
import {addWishlist,setLike,removeBook} from "../controllers/wishlistController.js";
const WishlistRoute = express.Router();

WishlistRoute.post("/wishlist",addWishlist);
WishlistRoute.get("/Wishlist",setLike)
WishlistRoute.post("/wishlist/remove",removeBook)

export default WishlistRoute;