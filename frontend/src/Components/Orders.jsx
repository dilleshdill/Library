import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import UserHeader from "./UserHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Orders = () => {
    const [cart, setCart] = useState([]);
    const Navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            const email = localStorage.getItem("email");
            try {
                if (email) {
                    const response = await axios.get(`${import.meta.env.VITE_DOMAIN}/orders?email=${email}`);
                    setCart(response.data);
                    console.log(response.data)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    
    const removeItem = async (bookId) => {
        const email = localStorage.getItem("email");
        try {
            // Remove from user's orders
            const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/orders/remove`, { bookId, email });
            
            if (response.status === 200) {
                setCart(response.data.orders); // Update cart with new data
    
                // Remove from admin orders
                await axios.post(`${import.meta.env.VITE_DOMAIN}/orders/admin-orders/remove`, { bookId, email });
    
                showToast("Order removed successfully", "info");
            }
        } catch (error) {
            console.error("Error removing item:", error);
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


    return (
        <div className="w-full h-full bg-white bg-opacity-90 fixed top-0 overflow-y-auto">
            <UserHeader className="fixed" />
            <ToastContainer/>
            <div className="flex flex-col lg:flex-row min-h-screen justify-center p-5">
                <div className="lg:w-3/4 w-full bg-white p-5">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 pb-5 text-center lg:text-left">
                        Orderss ({cart.length})
                    </h2>
                    {cart.map((item) => (
                        <div key={item.id} className="flex flex-col lg:flex-row bg-gray-100 mb-5 rounded-lg p-5 shadow-sm hover:shadow-md hover:bg-gray-200 transition duration-300">
                            <img src={item.book_url} alt={item.book_name} className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-md mx-auto lg:mx-0" />
                            <div className="ml-4 flex-1 text-center lg:text-left">
                                <h3 className="text-lg font-bold text-gray-800">{item.book_name}</h3>
                                <p className="text-gray-600">Price: ₹{item.price}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span className="text-xl font-bold pl-5 mr-0 pr-0">count : {item.count}</span>
                                    
                                </div>
                                <div className="flex items-center justify-center lg:justify-end pr-5 mt-2">
                                    <Popup trigger={<button className="text-red-500 !bg-transparent" style={{ border: 0, outline: 0 }}>Cancel</button>} modal>
                                        {close => (
                                            <div className="p-6 pt-0 text-center">
                                                <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to remove this item?</h3>
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => {
                                                            removeItem(item.bookId);
                                                            console.log(item.bookId)
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

            </div>
        </div>
    );
};

export default Orders;
