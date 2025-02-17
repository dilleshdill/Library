import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import UserHeader from "./UserHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Favorite = () => {
    const [cart, setCart] = useState([]);
    const Navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            const email = localStorage.getItem("email");
            try {
                if (email) {
                    const response = await axios.get(`http://localhost:5002/favorite?email=${email}`);
                    setCart(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
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

    const removeItem = async (book_name) => {
        const email = localStorage.getItem("email");
        try {
            const response = await axios.post("http://localhost:5002/favorite/remove", { book_name, email });
            if (response.status === 200) {
                setCart(cart.filter((item) => item.book_name !== book_name));
                showToast("Remove From Cart","info")
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const setIncrement = async (book_name) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.book_name === book_name
                    ? { ...item, count: item.count + 1 }
                    : item
            )
        );

        const email = localStorage.getItem("email");
        const updatedItem = cart.find(item => item.book_name === book_name);

        try {
            const response = await axios.post("http://localhost:5002/favorite/increment", {
                book_name,
                email,
                count: updatedItem.count + 1
            });
            if (response.status === 200) {
                const updatedItem = response.data.favorites.find(item => item.book_name === book_name);
                setCart(cart.map(item => item.book_name === book_name ? updatedItem : item));
            }
        } catch (error) {
            console.error("Error incrementing item:", error);
        }
    };

    const setDecrement = async (book_name) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.book_name === book_name && item.count > 1
                    ? { ...item, count: item.count - 1 }
                    : item
            )
        );

        const email = localStorage.getItem("email");
        const updatedItem = cart.find(item => item.book_name === book_name);

        if (updatedItem.count > 1) {
            try {
                const response = await axios.post("http://localhost:5002/favorite/increment", {
                    book_name,
                    email,
                    count: updatedItem.count - 1
                });
                if (response.status === 200) {
                    const updatedItem = response.data.favorites.find(item => item.book_name === book_name);
                    setCart(cart.map(item => item.book_name === book_name ? updatedItem : item));
                }
            } catch (error) {
                console.error("Error decrementing item:", error);
            }
        }
    };

    const subtotal = cart.reduce((total, item) => total + item.price * item.count, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="w-full h-full bg-white bg-opacity-90 fixed top-0 overflow-y-auto">
            <UserHeader className="fixed" />
            <ToastContainer/>
            <div className="flex flex-col lg:flex-row min-h-screen p-5">
                <div className="lg:w-3/4 w-full bg-white p-5">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 pb-5 text-center lg:text-left">
                        Favorites ({cart.length})
                    </h2>
                    {cart.map((item) => (
                        <div key={item.id} className="flex flex-col lg:flex-row bg-gray-100 mb-5 rounded-lg p-5 shadow-sm">
                            <img src={item.book_url} alt={item.book_name} className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-md mx-auto lg:mx-0" />
                            <div className="ml-4 flex-1 text-center lg:text-left">
                                <h3 className="text-lg font-bold text-gray-800">{item.book_name}</h3>
                                <p className="text-gray-600">Price: ₹{item.price}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <button className="text-gray-600 w-[40px] !bg-transparent outline-none border-0" style={{border:0,outline:0}} onClick={() => setDecrement(item.book_name)}><FaMinusCircle className=" text-2xl" /></button>
                                    <span className="text-2xl font-bold pl-5 mr-0 pr-0">{item.count}</span>
                                    <button className="text-blue-600 w-[40px] outline-none border-0 !bg-transparent" style={{border:0,outline:0}} onClick={() => setIncrement(item.book_name)}><FaPlusCircle className=" text-2xl" /></button>
                                </div>
                                <div className="flex items-center justify-center lg:justify-end pr-5 mt-2">
                                    <Popup trigger={<button className="text-red-500 !bg-transparent" style={{ border: 0, outline: 0 }}>Remove</button>} modal>
                                        {close => (
                                            <div className="p-6 pt-0 text-center">
                                                <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to remove this item?</h3>
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => {
                                                            removeItem(item.book_name);
                                                            close();
                                                        }}
                                                        className="text-white !bg-blue-500 hover:bg-red-800 font-medium rounded-lg text-base px-3 py-2.5 mr-2"
                                                    >
                                                        Yes, I'm sure
                                                    </button>
                                                    <button
                                                        onClick={close}
                                                        className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-base px-3 py-2.5"
                                                    >
                                                        No, cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:w-1/4 w-full mt-10 lg:mt-20 bg-gray-100 p-6 rounded-lg">
                    <div className="sticky top-0 p-5 bg-gray-100 md:h-[80vh] flex flex-col justify-between rounded-lg">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Summary</h2>
                            <div className="mt-15">
                                <div className="flex justify-between">
                                    <p className="text-gray-800">Subtotal:</p>
                                    <p>₹{subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-800">Tax:</p>
                                    <p>₹{tax.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <p className="text-2xl font-bold text-gray-800">Total:</p>
                                <p>₹{total.toFixed(2)}</p>
                            </div>
                            <button onClick={()=>Navigate('/address')} className="w-full py-2 mt-4 !bg-gray-800 text-white">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorite;
