import BooksModel from "../models/BooksModel.js";
import dotenv from "dotenv";

dotenv.config();

const addBook = async (req, res) => {
  const { book_name, book_url, author, rating, price,catogory, discription, date } = req.body;
  try {
    const Book = await BooksModel.findOne({ book_name });
    if (Book) {
      return res.status(400).json({ message: "Book is already present" });
    }
    const newBook = await BooksModel.create({
      book_name,
      book_url,
      author,
      rating,
      catogory,
      price,
      discription,
      date,
    });
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  const {bookName}=req.query
  console.log(bookName)
  try {
    if (bookName===""){
      let books = await BooksModel.find()
      return res.status(200).json(books);
    }
    else{
      let books = await BooksModel.find({book_name:bookName});
      return res.status(200).json(books);
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};

const getSearchBooks = async (req, res) => {
  const { bookName } = req.query;
  console.log(bookName)
  if (!bookName) {
      const books = await BooksModel.find();
      return res.status(200).json(books);
  }

  try {
      console.log("Searching for:", bookName);

      const books = await BooksModel.find();
      const searchFilter = books.filter(eachItem=>eachItem.book_name==bookName)
      if (searchFilter.length === 0) {
          return res.status(200).json([]);
      }
      if(!searchFilter){
        res.status(200).json(books);
      }
      res.status(200).json(searchFilter);
  } catch (error) {
      console.error("Error searching for books:", error);
      res.status(500).json({ message: "Error searching for books", error: error.message });
  }
};


const getBook = async (req, res) => {
  const { _id } = req.params;  // Access ID from URL params
  try {
    const book = await BooksModel.findOne({ _id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
};


export { addBook, getAllBooks, getBook,getSearchBooks };
