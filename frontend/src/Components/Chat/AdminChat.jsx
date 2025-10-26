import { useEffect, useState } from "react";
import UserHeader from "../UserHeader";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import UsersList from "./UsersList";
import ChatMessages from "./ChatMessages";
import axios from "axios";
const socket = io(`${import.meta.env.VITE_SOCKET_DOMAIN}`, {
  autoConnect: true,
  withCredentials: true,
  transports: ["websocket"],
});

export default function AdminChatApp() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.emit("join", "admin@gmail.com");

    socket.on("receive-message", ({ sender_id, text }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text, sender: sender_id },
      ]);
    });
    
    return () => {
      socket.disconnect();
    };
      
  }, []);

  const sendMessage = () => {
    if (text.trim() === "" || !activeUser) return;

    socket.emit("send-message", { receiver_id: activeUser.email, text });

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text, sender: "me" },
    ]);

    setText("");
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <UserHeader />
      <div className="flex flex-row w-screen  h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50 to-blue-100">
        <UsersList activeUser={activeUser} setActiveUser={setActiveUser} />
        <div className="md:flex items-center justify-center w-full hidden">
          <h1>select any user</h1>
        </div>
      </div>
    </div>
  );
}