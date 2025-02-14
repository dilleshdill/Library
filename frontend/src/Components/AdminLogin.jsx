import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/admin/login", { username, password });
      alert("Login successful");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Failed:", error);
      alert(error.response?.data?.message || "Incorrect username or password.");
    }
  };

  return (
    <div className="font-sans flex justify-center items-center w-screen min-h-screen px-4">
      <div className="max-w-md w-full px-6 py-6 shadow-md rounded-lg bg-white">
        <form onSubmit={toLogin}>
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">Admin Login</h3>
          </div>

          <div>
            <label className="text-gray-800 text-xs block mb-2">Username</label>
            <div className="relative flex items-center">
              <input
                name="username"
                type="text"
                required
                className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type="password"
                required
                className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-3 text-sm text-gray-800">
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-[#131B2B] hover:bg-blue-700 focus:outline-none"
              style={{ background: "#131B2B", border: "none", outline: "none" }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AdminLogin;
