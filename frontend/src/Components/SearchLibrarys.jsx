import axios from "axios";
import { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";

const SearchLibrarys = () => {
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // Fetch books based on search
    const fetchSearch = async (query) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_DOMAIN}/library/search-books`, {
                params: { query }
            });

            if (response.status === 200) {
                setBooks(response.data.books);
                console.log(response.data.books)
            } else {
                setBooks([]);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search) {
            fetchSearch(search);
        }
    }, []);

    const handleSearch = () => {
        if (!search.trim()) return;

        localStorage.setItem("search", search);
        fetchSearch(search);
    };

    return (
        <>
        <UserHeader/>
        <div className="min-h-screen w-screen px-4 sm:px-8 py-6 bg-gray-100">
            <div className="mb-6">
                <h1 className="flex justify-center">search Books from Different Librarys</h1>
            </div>
            {/* Search Bar */}
            <div className="mx-auto max-w-3xl bg-white flex  sm:flex-row items-center py-3 px-5 rounded-2xl shadow-lg">
                <input
                    type="text"
                    placeholder="Search for books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-auto flex-1 px-4 py-2 rounded-md outline-none bg-gray-50 text-gray-700 placeholder-gray-400"
                />
                <button
                    onClick={handleSearch}
                    className="mt-2 sm:mt-0 sm:ml-2 px-6 py-2 !bg-gray-800 text-white rounded-xl transition-all hover:bg-gray-800 active:scale-95"
                >
                    Search
                </button>
            </div>

            {/* Book Results */}
            <div className="mt-8">
                {loading && <p className="text-center text-gray-500">Loading books...</p>}
                {!loading && books.length === 0 && <p className="text-center text-gray-500">No books found.</p>}

                {!loading && books.length > 0 && (
                    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">  
                        {books.map((book) => (
                            <div key={book._id} className="p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition flex flex-col sm:flex-row">
                                {/* Left Section - Book Image */}
                                <img src={book.book_url} alt={book.book_name} className="w-full h-50 sm:w-32 sm:h-full object-cover rounded-md" 
                                    onClick={() => {
                                        localStorage.setItem("selectedLibrary", book.libraryId._id);
                                        navigate(`/books/${book._id}`);
                                    }}
                                />

                                {/* Right Section - Book Details */}
                                <div className="ml-0 sm:ml-4 mt-3 sm:mt-0 flex-1 " 
                                    onClick={() => {
                                        localStorage.setItem("selectedLibrary", book.libraryId._id);
                                        navigate('/books');
                                    }}>
                                    <h3 className="text-xl font-semibold">{book.book_name}</h3>

                                    {/* Rating */}
                                    <div className="flex items-center mt-3">
                                        <span className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded-lg flex items-center">
                                            {book.rating} <FaStar className="ml-1" />
                                        </span>
                                        <span className="text-gray-600 ml-2">{book.reviews || "17"} Ratings</span>
                                    </div>

                                    {/* Location */}
                                    <p className="text-gray-600 mt-3 flex items-center ">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                                        {book.libraryId?.name || "Unknown"}
                                    </p>

                                    {/* Categories */}
                                    <div className="flex flex-wrap mt-3 gap-2">
                                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm">
                                            {book.category}
                                        </span>
                                        {/* <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm">
                                            Second Hand Book Shops
                                        </span> */}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap mt-4 gap-2">
                                        <button className="bg-green-600 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
                                            Show Number
                                        </button>
                                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300">
                                            <FaWhatsapp className="mr-2 text-green-500" />
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
        </>
    );
};

export default SearchLibrarys;
