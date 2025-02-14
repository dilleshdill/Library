import express from "express";
import  {addFavorite, setLike,removeFavorite,setIncrement } from "../controllers/favoriteController.js";

const FavoriteRoute = express.Router();

FavoriteRoute.post("/favorite", addFavorite);
FavoriteRoute.get("/favorite", setLike);
FavoriteRoute.post("/favorite/remove", removeFavorite);
FavoriteRoute.post("/favorite/increment", setIncrement);

export default FavoriteRoute;