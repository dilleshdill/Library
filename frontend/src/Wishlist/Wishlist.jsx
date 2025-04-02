import { useEffect, useState } from "react";
import UserHeader from "../Components/UserHeader";
import axios from "axios";
import { FaIndianRupeeSign, FaStar, FaRegStar } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
    const [books, setBooks] = useState([]);
    const Navigate = useNavigate()
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const email = localStorage.getItem("email");
                if (email) {
                    const response = await axios.get(`http://localhost:5002/books/wishlist?email=${email}`);
                    setBooks(response.data);
                }
                else{
                    // Navigate("/login")
                    return
                }
            } catch (error) {
                console.log("Server error:", error);
            }
        };

        fetchWishlist();
    }, []);

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

    const toRemove = async (book_name) => {
        const email = localStorage.getItem("email");
        try {
            const response = await axios.post("http://localhost:5002/books/wishlist/remove", { book_name, email });
            if (response.status === 200) {
                setBooks(books.filter((item) => item.book_name !== book_name));
                showToast("Removed from Wishlist","info")
            }
        } catch (error) {
            console.error("Error removing item:", error);
            showToast("Error to Remove","error")
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <UserHeader />
            <ToastContainer/>
            <div className="flex flex-wrap p-5">
                {books.length === 0 ? (
                    <p>Your wishlist is empty.</p>
                ) : (
                    books.map((book) => (
                        <div key={book._id} className="w-full md:w-[30%] lg:w-[18%] mb-6 mr-6">
                            <div className="relative flex flex-col rounded-lg border border-gray-100 bg-white shadow-md">
                                <Link to={`/books/${book._id}`} className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                                    <img
                                        className="object-cover w-full h-full"
                                        src={book.book_url || "https://via.placeholder.com/150"}
                                        alt={book.book_name}
                                    />
                                </Link>

                                <div className="mt-4 px-5 pb-5">
                                    <h5 className="text-xl font-bold tracking-tight text-slate-900">
                                        {book.book_name}
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

                                    <div className="flex items-center justify-between pt-3">
                                        <Popup trigger={<button className="hover:!bg-gray-600 !border-gray-500 !text-red-400 !bg-transparent hover:!text-white !pt-2 !pb-2 !mt-2" style={{ border: 0, outline: 0 }}>Remove</button>} modal>
                                            {close => (
                                                <div className="p-6 pt-0 text-center">
                                                    <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to remove this item?</h3>
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => {
                                                                toRemove(book.book_name);
                                                                close();
                                                            }}
                                                            style={{border:0,outline:0}}
                                                            className="text-white !bg-blue-500  font-medium rounded-lg text-base px-3 py-2.5 mr-2"
                                                        >
                                                            Yes, I'm sure
                                                        </button>
                                                        <button
                                                            onClick={close}
                                                            style={{border:0,outline:0}}
                                                            className="text-gray-900 !bg-gray-300 hover:!bg-red-400 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-base px-3 py-2.5"
                                                        >
                                                            No, cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                        <button className="hover:!bg-gray-600 !border-gray-500 !text-gray-500 hover:!text-white !pt-1 !pb-1 !mt-2"
                                        onClick={()=>Navigate('/favorite')}>
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Wishlist;
