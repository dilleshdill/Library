import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaIndianRupeeSign, FaStar, FaRegStar } from "react-icons/fa6";
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "./SearchBar";

const ViewBooks = ({selectedFilters}) => {
    const [books, setBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);
    const [likedBooks,setLikedBooks] = useState([])
    const [loading, setLoading] = useState(true);
    const [refresh,setRefresh] = useState(true)


    useEffect(() => {  
        fetchBooksAndFavorites();
    },[refresh,selectedFilters]);

    const fetchBooksAndFavorites = async () => {
        try {
            const email = localStorage.getItem("email")
            const searchItem = await axios.get(`http://localhost:5002/getSearch?email=${email}`);
            const searchTerm = searchItem.data.value || "";
            const booksResponse = await axios.get(`http://localhost:5002/admin/book?bookName=${searchTerm}`);
            if (selectedFilters.length ===0){
                setBooks(booksResponse.data);
            }
            console.log(booksResponse.data)
            if (selectedFilters.length !== 0) {
                const lowerCaseCategories = selectedFilters.map(cat => cat.toLowerCase());
                const filteredBooks = booksResponse.data.filter(book => 
                    book.catogory && lowerCaseCategories.includes(book.catogory.toLowerCase())
                );
            
                setBooks(filteredBooks);
            }
            if (email) {
                const favResponse = await axios.get(`http://localhost:5002/favorite?email=${email}`);
                setCartBooks(favResponse.data);
            }
            if (email) {
                const favResponse = await axios.get(`http://localhost:5002/books/wishlist?email=${email}`);
                setLikedBooks(favResponse.data);
            }
        } catch (error) {
            console.log("Error fetching books or favorites:", error);
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

    const toAddFavorite = async (book, event) => {
        event.stopPropagation();
        try {
            const email = localStorage.getItem("email");
            if (!email) {
                alert("Please log in to add favorites.");
                return;
            }

            const response = await axios.post("http://localhost:5002/favorite", {
                email,
                book_name: book.book_name,
                book_url: book.book_url,
                price: book.price,
            });

            if (response.status === 200) {
                showToast("Added to Cart", "success");
                setCartBooks(prev => [...prev, book]);
            } else if (response.status === 201) {
                showToast("Removed from Cart", "info");
                setCartBooks(prev => prev.filter(item => item.book_name !== book.book_name));
            }
        } catch (error) {
            console.error("Error adding/removing favorite:", error);
            showToast("Error updating Cart", "error");
        }
    };

    const toAddWishList = async (book, event) => {
        event.stopPropagation();
        try {
            const email = localStorage.getItem("email");
            const response = await axios.post("http://localhost:5002/books/wishlist", {
                email,
                book_name: book.book_name,
                book_url: book.book_url,
                date: book.date,
                author: book.author,
                rating: book.rating,
                price: book.price,
            });
            if (response.status === 200) {
                showToast("Added to Wishlist", "success");
                setLikedBooks(prev => [...prev, book])
            }else if (response.status === 201) {
                showToast("Removed from Wishlist", "info");
                setLikedBooks(prev => prev.filter(item => item.book_name !== book.book_name));
            }
        } catch (error) {
            alert("Error adding to wishlist");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <SearchBar doRefresh={()=>{setRefresh(!refresh)}} />
        <div className="p-10 w-full ">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4">Book List</h2>
            <div className="flex flex-wrap justify-start">
                {books.map((book) => (
                    <div key={book._id} className="w-full md:w-[30%] lg:w-[18%] mb-6 mr-6">
                        <div className="relative flex flex-col rounded-lg border border-gray-100 bg-white shadow-md">
                            <Link to={`/books/${book._id}`} className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                                <img
                                    className="object-cover w-full h-full"
                                    src={book.book_url || "https://via.placeholder.com/150"}
                                    alt={book.book_name}
                                />
                            </Link>

                            <div
                                className="h-[30px] w-[30px] bg-white flex items-center justify-center rounded-2xl absolute z-50 left-50 top-5 cursor-pointer"
                                onClick={(event) => toAddWishList(book, event)}
                            >
                                {likedBooks.find(item => item.book_name === book.book_name) ? (
                                    <MdFavorite className="text-xl text-red-500" />
                                ) : (
                                    <MdOutlineFavoriteBorder className="text-xl" />
                                )}
                            </div>

                            <div className="mt-4 px-5 pb-5">
                                <h5 className="text-xl font-bold tracking-tight text-slate-900">
                                {book.book_name.length > 15 
                                ? `${book.book_name.slice(0, 15)}...` 
                                : book.book_name}
                                </h5>
                                <p className="text-sm text-gray-600 pt-1">Author: {book.author}</p>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex items-center">
                                        <FaIndianRupeeSign className="text-xl font-bold text-slate-900" />
                                        <span className="text-xl font-bold text-slate-900 ml-1">
                                            {book.price}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) =>
                                            index < book.rating ? (
                                                <FaStar key={index} className="text-yellow-500 h-5 w-5" />
                                            ) : (
                                                <FaRegStar key={index} className="text-yellow-500 h-5 w-5" />
                                            )
                                        )}
                                        <span className="ml-2 rounded bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold">
                                            {book.rating}.0
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    {cartBooks.find(item => item.book_name === book.book_name) ? (
                                        <button
                                            className="hover:!bg-gray-600 !border-gray-500 !text-gray-500 hover:!text-white !pt-1 !pb-1 !mt-2"
                                            onClick={(event) => toAddFavorite(book, event)}
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            className="hover:!bg-gray-600 !border-gray-500 !text-gray-500 hover:!text-white !pt-1 !pb-1 !mt-2"
                                            onClick={(event) => toAddFavorite(book, event)}
                                        >
                                            Cart
                                        </button>
                                    )}

                                    <button className="hover:!bg-gray-600 !border-gray-500 !text-gray-500 hover:!text-white !pt-1 !pb-1 !mt-2">
                                        Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default ViewBooks;
