import { useEffect, useState, useRef } from "react";
import UserHeader from "../UserHeader";
import { io } from "socket.io-client";
import axios from "axios";
import LibrarysList from "./LibrarysList";

const socket = io("http://localhost:5002", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [chatId, setChatId] = useState("");

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        // 1. Fetch user ID
        const { data: userData } = await axios.post(
          "http://localhost:5002/api/auth/userid",
          { email },
          { withCredentials: true }
        );

        const { id } = userData;
        setUserId(id);

        // 2. Fetch chat and messages
        const { data: chatData } = await axios.get(
          `http://localhost:5002/chat/${id}`
        );

        if (chatData.length > 0) {
          const chatId = chatData[0]._id;
          setChatId(chatId);
          socket.emit("join", chatId);

          const { data: messageData } = await axios.get(
            `http://localhost:5002/message/${chatId}`
          );

          // Ensure consistent message structure
          const formattedMessages = messageData.map((msg) => ({
            id: msg._id,
            text: msg.text,
            sender: msg.senderId === id ? "me" : "other",
          }));

          setMessages(formattedMessages);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    socket.connect();
    initializeChat();

    // 3. Listen for incoming messages
    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => {
        // Check if message already exists (to prevent duplication)
        if (prev.some((msg) => msg.id === newMessage._id)) return prev;

        return [
          ...prev,
          {
            id: newMessage._id,
            text: newMessage.text,
            sender: newMessage.senderId === userId ? "me" : "other",
          },
        ];
      });

      scrollToBottom();
    });

    return () => {
      socket.off("receive-message");
      socket.off("join");
    };
  }, [userId]);

  // Send message function
  const sendMessage = async () => {
    if (!text.trim() || !chatId || !userId) return;

    try {
      const newMessage = { chatId, senderId: userId, text };

      // Send message to backend
      const { data: sentMessage } = await axios.post(
        "http://localhost:5002/message",
        newMessage,
        { withCredentials: true }
      );

      // Emit message to socket (no need to manually update messages state)
      socket.emit("send-message", sentMessage);

      // Clear the input field
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    // <div className="h-screen w-screen flex flex-col items-center">
    //   <UserHeader className="w-screen" />
      
    //   <div className="flex h-screen w-screen">
    //     <LibrarysList/>
  
    //   </div>
      
    // </div>
    <div className="h-screen w-screen flex flex-col">
      <UserHeader />
        <div className="flex flex-row w-screen  h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50 to-blue-100">
          <LibrarysList/>
            <div className="md:flex items-center justify-center w-full hidden">
              <h1>select any user</h1>
            </div>
        </div>
  </div>
  );
}