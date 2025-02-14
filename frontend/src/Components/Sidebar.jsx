import React, { useState } from 'react';
import { IoLibrary } from "react-icons/io5";
import { MdOutlineHome } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { MdFavoriteBorder } from "react-icons/md";
import { BiCartAdd } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" h-screen fixed w-[15%]">
      {/* Sidebar Toggle Button (Visible only on mobile) */}
      <button 
        className="md:hidden  p-2 bg-gray-200 rounded-full"
        onClick={toggleSidebar}
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Sidebar */}
      <div 
        className={`flex flex-col h-screen md:w-full w-[300px] shadow-xl items-center fixed bg-white md:static lg:w-full 
                    ${isSidebarOpen ? 'left-0' : '-left-[300px]'} transition-all md:left-0`}
      >
        <button className="ml-[80%] mb-0 md:hidden"  onClick={toggleSidebar}><RxCross2 /></button>
        <div className="flex w-full justify-center pt-8">
          <IoLibrary className="text-black text-[40px]" />
          <p className="text-3xl font-[700] text-black pl-3">Library</p>
        </div>
        <div className="w-[50%] flex flex-col pt-[80px]">
          <div className="flex pb-5">
            <MdOutlineHome className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Discover</p>
          </div>
          <div className="flex pb-5">
            <TbCategory className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]-">Category</p>
          </div>
          <div className="flex pb-5">
            <MdFavoriteBorder className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Favorite</p>
          </div>
          <div className="flex pb-5">
            <BiCartAdd className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Orders</p>
          </div>
          <div className="flex pb-5">
            <IoChatbubbleEllipsesOutline className="text-black text-2xl" />
            <p className="pl-3 text-black text-[18px] font-[600]">Chat</p>
          </div>
        </div>
        <hr className="w-[200px] pl-[200px]" />
        <div className="w-[50%] pt-5">
          <div className="flex pb-5">
            <IoIosLogOut className="text-black text-2xl" />
            <p className="pl-3 text-red-600 text-[18px] font-[600]">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
