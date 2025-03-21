import { useEffect, useState } from "react";
import UserHeader from "../UserHeader";
import { io } from "socket.io-client";
import axios from "axios";

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


  useEffect(() => {
    const initializeChat = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        // Fetch user ID from backend
        const { data: userData } = await axios.post(
          "http://localhost:5002/api/auth/userid",
          { email },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { id } = userData;
        setUserId(id);


        // Fetch chat ID using userId
        const { data: chatData } = await axios.get(
          `http://localhost:5002/chat/${id}`
        );

        if (chatData.length > 0) {
          const chatId = chatData[0]._id;
          setChatId(chatId);
          socket.emit("join", chatId);
          // Fetch existing messages
          const { data: messageData } = await axios.get(
            `http://localhost:5002/message/${chatId}`
          );

          // Ensure correct sender mapping
          const formattedMessages = messageData.map((msg) => ({
            ...msg,
            sender: msg.senderId === id ? "me" : "other",
          }));

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    socket.connect();
    initializeChat();
    
    socket.on("receive-message", ()=>{
      initializeChat()
    });

    return () => {
      socket.off("join");
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || !chatId || !userId) return; // Validate before sending

    try {
      const newMessage = {
        chatId,
        senderId: userId,
        text,
      };

      // Store message in database
      const { data: sentMessage } = await axios.post(
        "http://localhost:5002/message",
        newMessage,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Emit message via socket to notify the recipient
      socket.emit("send-message", newMessage);

      // Optimistic UI update
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: sentMessage.text,
          sender: "me",
        },
      ]);

      setText(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      {/* User Header */}
      <UserHeader className="w-screen" />
  
      {/* Chat Container */}
      <div className="bg-gray-200 flex-1 overflow-y-scroll p-4 w-screen">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== "me" && (
              <img
                className="w-8 h-8 rounded-full mr-3"
                src="https://picsum.photos/50/50"
                alt="User Avatar"
              />
            )}
  
            <div
              className={`rounded-lg p-3 shadow max-w-lg w-auto ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.text}
            </div>
  
            {msg.sender === "me" && (
              <img
                className="w-8 h-8 rounded-full ml-3"
                src="https://picsum.photos/50/50"
                alt="User Avatar"
              />
            )}
          </div>
        ))}
      </div>
  
      {/* Input Box */}
      <div className="bg-gray-100 px-4 py-2 w-screen">
        <div className="flex items-center w-full">
          <input
            className="w-full border rounded-full py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <div
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full transition duration-300"
            onClick={sendMessage}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
}
