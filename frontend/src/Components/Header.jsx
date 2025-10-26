import React, { useState, useEffect, useRef } from 'react';
import { CiSearch, CiMenuBurger } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";

function Header({ onMenuToggle }) {
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const showDetails = () => {
    setIsShowDetails(!isShowDetails);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Header Content */}
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuToggle}
              className="md:hidden text-2xl text-gray-600 focus:outline-none"
            >
              <CiMenuBurger />
            </button>
            {/* <div className="hidden md:block">
              <h1 className="text-xl font-bold text-indigo-600">BookStore</h1>
            </div> */}
          </div>

          {/* Middle Section - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiSearch className="text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search books, authors, categories..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Section - Icons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button 
              onClick={toggleMobileSearch}
              className="md:hidden text-2xl text-gray-600 focus:outline-none"
            >
              {isMobileSearchOpen ? <IoIosClose /> : <CiSearch />}
            </button>

            {/* Notification */}
            <div className="relative">
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <IoMdNotificationsOutline className="text-2xl" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={showDetails}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src="https://prodimage.images-bn.com/pimages/9781649377159_p0_v5_s1200x1200.jpg"
                  alt="profile"
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border-2 border-indigo-100"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-700">John Doe</span>
                <IoIosArrowDown className={`text-gray-500 transition-transform ${isShowDetails ? 'transform rotate-180' : ''}`} />
              </button>

              {isShowDetails && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Books</a>
                  <div className="border-t border-gray-100"></div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible when toggled */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiSearch className="text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search books..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;