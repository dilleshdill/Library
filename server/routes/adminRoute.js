import {adminLogin,addAdmin} from "../controllers/adminController.js";
import {addBook,getAllBooks,getBook,getSearchBooks} from "../controllers/BooksController.js";
import express from "express";

const adminRoute = express.Router();

adminRoute.post('/login', adminLogin);
adminRoute.post('/register', addAdmin);
adminRoute.post('/add-book', addBook);
adminRoute.get('/book',getAllBooks);
adminRoute.get('/search',getSearchBooks);
adminRoute.get('/book-details/:_id',getBook);


export default adminRoute;
