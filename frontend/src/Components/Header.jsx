import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
function Header() {
    const [isShowDetails,setIsShowDetails] = useState(false)
    const showDetails = () => {
        setIsShowDetails(!isShowDetails)
    }
  return (
    <div className="w-full flex flex-col items-end ">
        <div className="flex justify-between items-center h-[80px] w-full  pt-0 mt-0 shadow-sm">
            <div className="flex h-[50px] bg-gray-200 items-center rounded-sm pl-3 ml-3 ">
                <CiSearch  className="text-2xl hidden md:block"/>
                <input type='search' placeholder='Search Books' className=" p-2 hidden md:block md:w-[500px] outline-0 " />
            </div>
            <div className="flex h-[50px] items-center w-[250px] justify-around">
                <IoMdNotificationsOutline className="text-3xl" />
                <img src='https://prodimage.images-bn.com/pimages/9781649377159_p0_v5_s1200x1200.jpg' alt='profile' className=" h-[50px] w-[50px] rounded-4xl" />
                <p>Profile</p>
                <button onClick={showDetails}><IoIosArrowDown /></button>
            </div>
        </div>
        {
            isShowDetails?(
                <div className="h-[100px] shadow-md w-[200px]">
                    <p> Profile</p>
                    <button>Logout</button>
                </div>
            ):null
        }
    </div>
  );
}

export default Header;