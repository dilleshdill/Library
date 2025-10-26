import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaIndianRupeeSign, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "./SearchBar";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const MaintainBooks = ({ selectedFilters }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    // const [counter, setCounter] = useState(0);
    const [libraryId, setLibraryId] = useState(localStorage.getItem("libraryId") || "");

    useEffect(() => {  
        fetchBooksAndFavorites();
    }, [refresh, selectedFilters, libraryId]);

    const fetchBooksAndFavorites = async () => {
        try {
            const searchTerm = "";
            let booksResponse;
            
            if (libraryId) {
                booksResponse = await axios.get(
                    `${import.meta.env.VITE_DOMAIN}/admin/book?bookName=${searchTerm}&libraryId=${libraryId}`
                );
            }
            console.log("Books Response:", booksResponse.data);
            setBooks(booksResponse?.data || []);
        } catch (error) {
            console.log("Error fetching books or favorites:", error);
            showToast("Failed to load books", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        toast[type](message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    };
    const modifyCount = async (_id,counter, action) => {
    if (!libraryId) {
      showToast("Please log in to modify favorites.","error")
      return;
    }
    console.log("Modify Count:", _id,counter, action);
    if (counter <= 0 && action === "decrement") {
        showToast("Count cannot be less than 0", "error");
        return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/admin/increment-book-count`, {
        _id,
        count: action === "increment" ? counter + 1 : counter - 1,
      });

      if (response.status === 200) {
        console.log("Count modified successfully:", response.data);
        
        fetchBooksAndFavorites();
      }
    } catch (error) {
      console.error(`Error ${action}ing item:`, error);
    }
  };
    const formatRating = (rating) => {
        // Handle cases where rating might be undefined, null, or not a number
        const num = Number(rating);
        return isNaN(num) ? "0.0" : num.toFixed(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ToastContainer />
            
            {/* Search and Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                
                <div className="w-full md:w-1/2">
                    <SearchBar doRefresh={() => setRefresh(!refresh)} />
                </div>
            </div>

            {libraryId ? (
                <>
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Book List</h2>
                    
                    {books.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No books found in this library</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {books.map((book) => (
                                <div key={book._id} className="group relative flex flex-col rounded-lg w-[220px] m-auto border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <Link 
                                        to={`/books/${book._id}`} 
                                        className="relative aspect-[3/4] overflow-hidden rounded-t-lg"
                                    >
                                        <img
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            src={book.book_url || "https://via.placeholder.com/300x400?text=No+Image"}
                                            alt={book.book_name}
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                                            }}
                                        />
                                    </Link>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                            {book.book_name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                            By {book.author}
                                        </p>

                                        <div className="mt-auto flex justify-between items-center pt-2">
                                            <div className="flex items-center">
                                                <FaIndianRupeeSign className="text-lg text-gray-800" />
                                                <span className="text-lg font-bold text-gray-800 ml-1">
                                                    {book.price || "0"}
                                                </span>
                                            </div>

                                            <div className="flex items-center bg-yellow-50 rounded-full px-2 py-1">
                                                <FaStar className="text-yellow-500 h-4 w-4" />
                                                <span className="text-sm font-medium text-gray-800 ml-1">
                                                    {formatRating(book.rating)}
                                                </span>
                                            </div>
                                            
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={async () => {
                                                        try {
                                                            await axios.delete(`http://localhost:5002/admin/delete-book/${book._id}`);
                                                            showToast("Book deleted successfully");
                                                            setRefresh(!refresh);
                                                        } catch (error) {
                                                            console.error("Error deleting book:", error);
                                                            showToast("Failed to delete book", "error");
                                                        }
                                                    }}
                                                >
                                                    Remove
                                            </button>
                                                            <div className="flex items-center ">
                                                              <button className="text-gray-600 !bg-transparent" style={{border:0,outline:0}} onClick={() => modifyCount(book._id,book.count, "decrement")}>
                                                                <FaMinusCircle className=" size-7" />
                                                              </button>
                                                              <span className="text-2xl font-bold pl-0 ml-0 mr-0 pr-0">{book.count}</span>
                                                              <button className="text-blue-600 !bg-transparent" style={{border:0,outline:0}} onClick={() => modifyCount(book._id,book.count, "increment")}>
                                                                <FaPlusCircle className="size-7" />
                                                              </button>
                                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <img 
                        src="https://img.freepik.com/premium-vector/ebook-choose-bookshelves-screen-smartphone-smart-education-digital-technology-learning-cartoon-concept_80590-7129.jpg?w=740" 
                        alt="Select a library"
                        className="w-full max-w-md mb-6"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Library Selected</h3>
                    <p className="text-gray-600 max-w-md">
                        Please select a library from the dashboard to view and manage its books.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MaintainBooks;