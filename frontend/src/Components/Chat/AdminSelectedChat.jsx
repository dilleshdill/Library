import { useEffect, useState } from "react";
import UserHeader from "../UserHeader";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import UsersList from "./UsersList";
import ChatMessages from "./ChatMessages";
import { useParams } from "react-router-dom";




export default function AdminSelectedChatApp() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <UserHeader />
        {/* Desktop View */}
      <div className="hidden md:flex flex-row w-screen h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <UsersList/>
        <ChatMessages />
      </div>
      {/* Mobile View */}
      <div className="md:hidden flex flex-row w-screen h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <ChatMessages />
      </div>
    </div>
  );
}
