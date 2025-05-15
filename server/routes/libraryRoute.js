import express from "express";
import {addLibrary,getLibraryDetails,searchBooks,getLibraryId,getTimings} from "../controllers/libraryController.js";
const LibraryRoute = express.Router();

// LibraryRoute.get("/", viewOrders); // Fetch orders using GET method
// LibraryRoute.post("/remove", removeOrder); // Route to remove an order
LibraryRoute.post("/add", addLibrary); // Route to add an order
LibraryRoute.get("/getlist",getLibraryId)
LibraryRoute.get("/:id", getLibraryDetails);
LibraryRoute.get("/search-books",searchBooks); 
LibraryRoute.post("/getTimings",getTimings)
export default LibraryRoute;