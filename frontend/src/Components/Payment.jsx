import { useState } from "react";

export default function Payment() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    paymentMethod: "Card",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, city, cardNumber, expiryMonth, expiryYear, cvc, paymentMethod } = formData;
    if (!name || !city || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
      setMessage("All fields are required!");
      return;
    }
    setMessage("Payment Method Added Successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Payment Method</h2>
        <p className="text-center mb-4">Add a new payment method to your account.</p>
        {message && <p className="text-center text-green-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button type="button" className="w-1/3 p-2 border rounded bg-blue-500 text-white">Card</button>
            <button type="button" className="w-1/3 p-2 border rounded">Paypal</button>
            <button type="button" className="w-1/3 p-2 border rounded">Apple</button>
          </div>
          <input type="text" name="name" placeholder="First Last" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="city" placeholder="City" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="cardNumber" placeholder="Card Number" className="w-full p-2 border rounded" onChange={handleChange} maxLength="16" />
          <div className="flex gap-2">
            <input type="text" name="expiryMonth" placeholder="Month" className="w-1/2 p-2 border rounded" onChange={handleChange} maxLength="2" />
            <input type="text" name="expiryYear" placeholder="Year" className="w-1/2 p-2 border rounded" onChange={handleChange} maxLength="4" />
          </div>
          <input type="text" name="cvc" placeholder="CVC" className="w-full p-2 border rounded" onChange={handleChange} maxLength="3" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Continue</button>
        </form>
      </div>
    </div>
  );
}
