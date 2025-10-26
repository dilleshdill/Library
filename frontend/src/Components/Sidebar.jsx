import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoLibrary, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlineHome, MdOutlineLibraryBooks, MdFavoriteBorder } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { BiCartAdd } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen fixed w-[15%]">
      {/* Toggle button for mobile */}
      <button 
        className="md:hidden p-2 bg-gray-200 rounded-full"
        onClick={toggleSidebar}
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Sidebar */}
      <div 
        className={`flex flex-col h-screen md:w-full w-[300px] shadow-xl items-center fixed bg-white md:static lg:w-full 
                    ${isSidebarOpen ? 'left-0' : '-left-[300px]'} transition-all md:left-0`}
      >
        <button className="ml-[80%] mb-0 md:hidden" onClick={toggleSidebar}>
          <RxCross2 />
        </button>

        <div className="flex w-full justify-center pt-8">
          <IoLibrary className="text-black text-[40px]" />
          <p className="text-3xl font-[700] text-black pl-3">Library</p>
        </div>

        <div className="w-[50%] flex flex-col pt-[80px] space-y-5">
          <Link to="/" className="flex items-center">
            <MdOutlineHome className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Discover</p>
          </Link>

          <Link to="/maintain-books" className="flex items-center">
            <MdOutlineLibraryBooks className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Books</p>
          </Link>

          <Link to="/category" className="flex items-center">
            <TbCategory className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Category</p>
          </Link>

          <Link to="/favorites" className="flex items-center">
            <MdFavoriteBorder className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Favorite</p>
          </Link>

          <Link to="/orders" className="flex items-center">
            <BiCartAdd className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Orders</p>
          </Link>

          <Link to="/chat" className="flex items-center">
            <IoChatbubbleEllipsesOutline className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Chat</p>
          </Link>
        </div>

        <hr className="w-[200px]" />

        <div className="w-[50%] pt-5">
          <div className="flex pb-5 cursor-pointer">
            <IoIosLogOut className="text-black text-2xl" />
            <p className="pl-3 text-red-600 text-[18px] font-[600]">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
