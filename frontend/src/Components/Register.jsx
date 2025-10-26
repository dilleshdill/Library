import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username,setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const toRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN}/api/auth/signup`, // Fixed API route
        { username,email, password },        
      );

      alert(response.data.message || "Registration successful!");
      localStorage.setItem({"email":email})
      navigate("/dashboard"); // Redirect to Login page
    } catch (error) {
      alert(error.response?.data?.message || "User already exists");
      console.error(" Registration Failed:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif] max-sm:px-4 md:w-screen flex justify-center items-center w-screen">
    <div className="md:max-w-[35%] w-full px-6 py-6 shadow-md rounded-lg">
      <form onSubmit={toRegister}>
        <div className="mb-12">
          <h3 className="text-gray-800 text-3xl font-extrabold">Register</h3>
          <p classNameName="text-sm mt-4 text-gray-800">
            You have an account?
            <span classNameName="text-blue-600 font-semibold cursor-pointer ml-1 whitespace-nowrap" onClick={() =>navigate("/")}>
              Login here
            </span>
          </p>
        </div>

        <div classNameName="flex-col w-full">
        <label className="text-gray-800 text-xs block mb-2">Username</label>
          <div className="relative flex items-center">
            <input
              name="email"
              type="text"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-2"
              viewBox="0 0 682.667 682.667"
            >
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                </clipPath>
              </defs>
              <g
                clip-path="url(#a)"
                transform="matrix(1.33 0 0 -1.33 0 682.667)"
              >
                <path
                  fill="none"
                  stroke-miterlimit="10"
                  stroke-width="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  data-original="#000000"
                ></path>
                <path
                  d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </div>
          <label className="text-gray-800 text-xs block mb-3 mt-2">Email</label>
          <div className="relative flex items-center">
            <input
              name="email"
              type="text"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-2"
              viewBox="0 0 682.667 682.667"
            >
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                </clipPath>
              </defs>
              <g
                clip-path="url(#a)"
                transform="matrix(1.33 0 0 -1.33 0 682.667)"
              >
                <path
                  fill="none"
                  stroke-miterlimit="10"
                  stroke-width="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  data-original="#000000"
                ></path>
                <path
                  d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-gray-800 text-[13px] block pb-2 ">Password</label>
          <div className="relative flex items-center">
            <input
              name="password"
              type="password"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
              viewBox="0 0 128 128"
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-gray-800 text-[13px] block pb-2">Confirm Password</label>
          <div className="relative flex items-center">
            <input
              name="password"
              type="password"
              required
              className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-1 outline-none"
              placeholder="Enter password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
              viewBox="0 0 128 128"
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" className="ml-3 block text-sm text-gray-800">
              Remember me
            </label>
          </div>
          <div>
            <a
              href="jajvascript:void(0);"
              className="text-blue-600 font-semibold text-sm hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            style={{ background: "#131B2B", border: "none", outline: "none" }}
          >
            Register
          </button>
        </div>


        <div className="my-4 flex items-center gap-4">
          <hr className="w-full border-gray-300" />
          <p className="text-sm text-gray-800 text-center">or</p>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="space-x-6 flex justify-center">
          <button type="button" className="border-none outline-none">
            <FcGoogle className="text-3xl" />
          </button>
          <button type="button" className="border-none outline-none">
            <IoLogoGithub className="text-3xl"/>
          </button>
          <button type="button" className="border-none outline-none">
            <FaFacebook className="text-blue-600 text-3xl" />
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default Register;
