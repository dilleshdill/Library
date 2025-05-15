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
    const [libraryList,setLibraryList] = useState([])
    const [libraryId,setLibraryId]=useState(localStorage.getItem("selectedLibrary")||"")
    useEffect(() => {  
        fetchBooksAndFavorites();
    },[refresh,selectedFilters,libraryId]);

    const fetchBooksAndFavorites = async () => {
        try {
            const email = localStorage.getItem("email");
            const searchItem = await axios.get(`http://localhost:5002/getSearch?email=${email}`);
            const searchTerm = searchItem.data.value || "";
    
            let booksResponse;
            
            if (libraryId) {
                // Fetch books for the selected library
                booksResponse = await axios.get(`http://localhost:5002/admin/book?bookName=${searchTerm}&libraryId=${libraryId}`);
            } else {
                // If no library is selected, fetch all books
                booksResponse = await axios.get(`http://localhost:5002/admin/book?bookName=${searchTerm}`);
            }
    
            let filteredBooks = booksResponse.data;
            
            if (selectedFilters.length > 0) {
                const lowerCaseCategories = selectedFilters.map(cat => cat.toLowerCase());
                filteredBooks = filteredBooks.filter(book => 
                    book.catogory && lowerCaseCategories.includes(book.catogory.toLowerCase())
                );
            }
    
            setBooks(filteredBooks);
            console.log(filteredBooks)
    
            if (email) {
                const favResponse = await axios.get(`http://localhost:5002/favorite?email=${email}`);
                setCartBooks(favResponse.data);
                console.log(favResponse.data)
    
                const wishlistResponse = await axios.get(`http://localhost:5002/books/wishlist?email=${email}`);
                setLikedBooks(wishlistResponse.data);
            }
    
            const response = await axios.get("http://localhost:5002/library/getlist");
            const libraryList = response.data.library.map(lib => ({
                name: lib.name,
                id: lib._id
            }));
            setLibraryList(libraryList);
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
            const libraryId = localStorage.getItem("selectedLibrary");
            console.log(book._id);  // this is the book's ID
            const response = await axios.post("http://localhost:5002/favorite", {
                email,
                bookId: book._id, // renamed field
                book_name: book.book_name,
                book_url: book.book_url,
                price: book.price,
                libraryId,
            });
    
            if (response.status === 200) {
                showToast("Added to favorites", "success");
                setCartBooks(prev => [...prev, book]);
                fetchBooksAndFavorites()
                console.log(cartBooks)
            } else if (response.status === 201) {
                showToast("Removed from favorites", "info");
                setCartBooks(prev => prev.filter(item => item.book_name !== book.book_name));
            }
        } catch (error) {
            console.error("Error adding/removing favorite:", error);
            showToast("Error updating favorites", "error");
        }
    };
    

    const toAddWishList = async (book, event) => {
        event.stopPropagation();
        try {
            const email = localStorage.getItem("email");
            if (!email){
                showToast("Login to add wishlist","error")
                return
            }
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
        <div className="mx-auto w-[90%] flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-lg rounded-lg gap-4">
            {/* Library Selection */}
            <div className="w-full md:w-[50%]">
                <label htmlFor="library" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a Library
                </label>
                <select
                    id="library"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none  "
                    style={{outline:0}}
                    // value={libraryId}
                    onChange={(e) => {
                        setLibraryId(e.target.value);
                        setRefresh(prev => !prev);
                        localStorage.setItem("selectedLibrary",e.target.value);
                    }}
                    
                >
                    <option >select the Library</option>
                    {libraryList.map((lib) => (
                        <option key={lib.id} value={lib.id}>
                            {lib.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-[50%] pt-5">
                
                <SearchBar doRefresh={() => setRefresh(!refresh)} />
            </div>
        </div>

        
        <div className="p-10 w-full ">
            <ToastContainer />
            {libraryId?(
                <>
                    <h2 className="text-2xl font-bold mb-4 md:pl-[2%]">Book List</h2>
                    <div className="flex flex-wrap justify-start m-auto md:pl-[2%] ">
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
                                        <p className="text-sm text-gray-600 pt-2">Author: {book.author}</p>

                                        <div className="flex justify-between items-center pt-3">
                                            <div className="flex items-center">
                                                <FaIndianRupeeSign className="text-xl font-bold text-slate-900" />
                                                <span className="text-xl font-bold text-slate-900 ml-1">
                                                    {book.price}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                {/* {[...Array(5)].map((_, index) =>
                                                    index < book.rating ? (
                                                        <FaStar key={index} className="text-yellow-500 h-5 w-5" />
                                                    ) : (
                                                        <FaRegStar key={index} className="text-yellow-500 h-5 w-5" />
                                                    )
                                                )} */}
                                                <div className="ml-2 rounded flex items-center  px-2.5 py-0.5 text-xs font-semibold">
                                                <FaStar className="text-yellow-500 h-5 w-5" />
                                                    <p className="text-[15px] pl-1">{book.rating}.0</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3">
                                            {cartBooks.find(item => item.bookId === book._id) ? (
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

                                            <button className="hover:!bg-gray-600 !border-gray-500 !text-gray-500 hover:!text-white !pt-1 !pb-1 !mt-2" onClick={()=>{`/books/${book._id}`}}>
                                                Borrow
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ):
            <div className="flex justify-center items-center">
            <img src="https://img.freepik.com/premium-vector/ebook-choose-bookshelves-screen-smartphone-smart-education-digital-technology-learning-cartoon-concept_80590-7129.jpg?w=740" alt="alt"
                className="sm:w-[25%] w-full"
            />
            </div>
            }
        </div>
        </>
    );
};

export default ViewBooks;
