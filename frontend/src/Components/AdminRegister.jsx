import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage(""); // Clear errors on input change
  }, [email, username, password, confirmPassword]);

  const validatePassword = (password) => {
    return password.length >=3;
  };

  const toRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long and contain letters & numbers.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/admin/register`, {
        username,
        email,
        password,
      });

      alert(response.data.message || "Registration successful!");
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif] flex justify-center items-center w-screen">
      <div className="md:max-w-[35%] w-full px-6 py-6 shadow-md rounded-lg">
        <form onSubmit={toRegister}>
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-extrabold">Register</h3>
            <p className="text-sm mt-4 text-gray-800">
              Already have an account?
              <span
                className="text-blue-600 font-semibold cursor-pointer ml-1 whitespace-nowrap"
                onClick={() => navigate("/adminLogin")}
              >
                Login here
              </span>
            </p>
          </div>

          {/* Username Input */}
          <div className="flex-col w-full">
            <label className="text-gray-800 text-xs block mb-2">Username</label>
            <input
              name="username"
              type="text"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="mt-3">
            <label className="text-gray-800 text-xs block mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mt-3">
            <label className="text-gray-800 text-[13px] block pb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mt-3">
            <label className="text-gray-800 text-[13px] block pb-2">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white !bg-gray-800 hover:!bg-gray-900 focus:outline-none"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
