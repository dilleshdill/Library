import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderArrived = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await axios.get(
          `http://localhost:5002/orders/details?email=${email}&orderId=${orderId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500";
      case "Shipped":
        return "bg-blue-500";
      case "Out for Delivery":
        return "bg-green-500";
      case "Delivered":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!order) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="w-full h-full bg-white bg-opacity-90 fixed top-0 overflow-y-auto">
      <UserHeader className="fixed w-full" />
      <ToastContainer />

      <div className="flex flex-col items-center min-h-screen p-5 pt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Details</h2>

        <div className="w-full max-w-4xl bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <img
            src={order.book_url}
            alt={order.book_name}
            className="w-40 h-40 object-cover rounded-md mx-auto mb-5"
          />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{order.book_name}</h3>
          <p className="text-lg text-gray-600">Price: ₹{order.price}</p>
          <p className="text-lg text-gray-600">Count: {order.count}</p>

          <div className="mt-5">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Order Tracking</h4>
            <div className="flex items-center space-x-4">
              {order.tracking.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStatusColor(
                      step.status
                    )}`}
                  >
                    {index + 1}
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{step.status}</p>
                  <p className="text-xs text-gray-500">{step.date}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderArrived;
