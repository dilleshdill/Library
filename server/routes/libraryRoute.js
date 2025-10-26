import express from "express";
import { addLibrary, getLibraryDetails, searchBooks, getLibraryId, getTimings } from "../controllers/libraryController.js";

const LibraryRoute = express.Router();

// Add a new library
LibraryRoute.post("/add", addLibrary);

// Get all libraries
LibraryRoute.get("/getlist", getLibraryId);

// Search books across libraries
LibraryRoute.get("/search-books", searchBooks); // PUT this BEFORE /:id

// Get library timings
LibraryRoute.post("/getTimings", getTimings);

// Get a single library details by ID (dynamic route at the end)
LibraryRoute.get("/:id", getLibraryDetails);

export default LibraryRoute;
