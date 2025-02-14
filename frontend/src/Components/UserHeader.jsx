import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="relative w-screen flex items-center justify-between sm:h-16 md:justify-between py-4 px-6 bg-white shadow-md text-gray-600 mt-0">
      {/* Desktop Menu */}
      <div className="hidden md:flex md:space-x-10">
      <Link
          to="/"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Home
        </Link>
        <Link
          to="/"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Categories
        </Link>
        <Link
          to="/books"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Books
        </Link>
        <Link
          to="/chat"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Chat
        </Link>
        <Link
          to="/"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Orders
        </Link>
        <Link
          to="/wishlist"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Wishlist
        </Link>
        <Link
          to="/favorite"
          className="font-medium !text-gray-600 hover:!text-gray-900 transition duration-150 ease-in-out"
        >
          Cart
        </Link>
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden flex items-center" onClick={toggleMenu}>
        <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Links Stack Vertically) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-0 left-0 w-full bg-white shadow-md p-4`}
      >
        <button className="text-gray-600 hover:text-gray-900 focus:outline-none" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <Link
          to="/"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Home
        </Link>
        <Link
          to="/"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Categories
        </Link>
        <Link
          to="/books"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Books
        </Link>
        <Link
          to="/chat"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Chat
        </Link>
        <Link
          to="/"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Orders
        </Link>
        <Link
          to="/wishlist"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Wishlist
        </Link>
        <Link
          to="/favorite"
          className="block py-2 px-4 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          Cart
        </Link>
      </div>

      {/* Right-side Login/Logout Buttons */}
      <div className="hidden md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
        <Link
          to="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium !text-gray-600 hover:!text-gray-900 focus:outline-none transition duration-150 ease-in-out"
        >
          Login
        </Link>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md !text-white bg-gray-800 hover:bg-black focus:outline-none transition duration-150 ease-in-out ml-2"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default UserHeader;
