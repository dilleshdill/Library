import BooksModel from "../models/BooksModel.js";
import Library from "../models/libraryModel.js";  
import dotenv from "dotenv";

dotenv.config();

/**
 * Add a new book
 */
const addBook = async (req, res) => {
  const { book_name, book_url, author, rating, price, category, description, date, libraryId } = req.body;

  try {
    // Check if library exists
    const libraryExists = await Library.findById(libraryId);
    if (!libraryExists) {
      return res.status(400).json({ message: "Library not found" });
    }

    // Check if the book already exists in the same library (case-insensitive)
    const existingBook = await BooksModel.findOne({ 
      book_name: { $regex: new RegExp(`^${book_name}$`, "i") }, 
      libraryId 
    });

    if (existingBook) {
      return res.status(400).json({ message: "Book already exists in this library" });
    }

    // Create new book
    const newBook = await BooksModel.create({
      book_name: book_name.toLowerCase(),
      book_url,
      author,
      rating,
      category,
      price,
      description,
      date,
      libraryId,
      available: true, // Ensure availability is set
    });

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};

// increment book count by admin

const incrementBookCount = async (req, res) => {
  
  const { count,_id } = req.body; // Get count from request body
console.log(count,_id)
  try {
    // Find the book by ID and update the count
    const updatedBook = await BooksModel.findByIdAndUpdate(
      _id,
      { count: count }, // Increment the count
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(400).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book count updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book count:", error);
    res.status(500).json({ message: "Error updating book count", error: error.message });
  }
}


//delete book by admin

const deletebook = async (req, res) => { 
  const { _id } = req.params; // Get the book ID from the request parameters
  console.log(_id)
  try {
    // Find the book by ID and delete it
    const deletedBook = await BooksModel.findByIdAndDelete(_id);

    if (!deletedBook) {
      return res.status(400).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
}

/**
 * Get all books (with optional filters)
 */
const getAllBooks = async (req, res) => {
  const { bookName, libraryId } = req.query;

  try {
    let query = {};

    if (libraryId) query.libraryId = libraryId;
    if (bookName) query.book_name = { $regex: bookName, $options: "i" }; // Case-insensitive search

    const books = await BooksModel.find(query);
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};

/**
 * Get a single book by ID
 */
const getBook = async (req, res) => {
  const { _id } = req.params;  
  console.log(_id)
  try {
    const book = await BooksModel.findById(_id).populate("libraryId", "name address contact"); // Populate library details
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }
    console.log(book)
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
};

/**
 * Search books based on name
 */
const getSearchBooks = async (req, res) => {
  const { bookName } = req.query;

  try {
    if (!bookName) {
      const books = await BooksModel.find();
      return res.status(200).json(books);
    }

    const books = await BooksModel.find({
      book_name: { $regex: bookName, $options: "i" }, // Case-insensitive search
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching for books:", error);
    res.status(500).json({ message: "Error searching for books", error: error.message });
  }
};

export { addBook, getAllBooks, getBook, getSearchBooks,incrementBookCount,deletebook };
