import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SOCKET_DOMAIN}`, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default function ChatMessages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { id } = useParams();
  const [userId, setUserId] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const chatId = id;
        const res = await axios.get(`${import.meta.env.VITE_DOMAIN}/chat/${chatId}`);
        console.log("Chat details:", res.data);

        const response = await axios.get(`${import.meta.env.VITE_DOMAIN}/message/${id}`);
        const receiver = localStorage.getItem("email");
        const registerRes = await axios.get(`${import.meta.env.VITE_DOMAIN}/api/auth/getid/${receiver}`);
        const receiverId = registerRes.data.user._id;

        setUserId(receiverId);
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (id) {
      socket.connect();
      getMessages();
      socket.emit("join", id);

      socket.on("receive-message", () => {
        getMessages();
      });

      return () => {
        socket.off("receive-message");
      };
    }
  }, [id]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const newMessage = {
        chatId: id,
        senderId: userId,
        text,
      };

      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/message`, newMessage);

      setMessages((prev) => [...prev, response.data]);
      setText("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-scroll p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            {msg.senderId !== userId && (
              <img
                className="w-10 h-10 rounded-full mr-3"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="User Avatar"
              />
            )}

            <div
              className={`rounded-md p-2 flex gap-3 items-center shadow-md max-w-lg  ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-xs mt-1 text-right ${
                  msg.senderId === userId ? "text-white/70" : "text-gray-500"
                }`}
              >
                {formatTime(msg.createdAt)}
              </span>
            </div>

            {msg.senderId === userId && (
              <img
                className="w-10 h-10 rounded-full ml-3"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="User Avatar"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-100 px-6 py-4 w-full shadow-lg sticky bottom-0">
        <div className="flex items-center">
          <input
            className="flex-1 border rounded-full py-3 px-6 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <div
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300 cursor-pointer"
            onClick={sendMessage}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
}
