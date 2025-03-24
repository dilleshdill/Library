import express from "express";
import  {addFavorite, setLike,removeFavorite,setIncrement,clearFavorites } from "../controllers/favoriteController.js";
import { clear } from "console";

const FavoriteRoute = express.Router();

FavoriteRoute.post("/favorite", addFavorite);
FavoriteRoute.get("/favorite", setLike);
FavoriteRoute.post("/favorite/remove", removeFavorite);
FavoriteRoute.post("/favorite/increment", setIncrement);
FavoriteRoute.post("/favorite/clear", clearFavorites);
export default FavoriteRoute;