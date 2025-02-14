import {searchItem,getSearchItem} from "../controllers/searchController.js";
import express from 'express'

const searchRoute = express.Router()

searchRoute.post("/",searchItem)
searchRoute.get("/",getSearchItem)

export default searchRoute;