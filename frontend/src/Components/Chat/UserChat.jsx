import { useEffect, useState, useRef } from "react";
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
    <div className="h-screen w-screen flex flex-col items-center">
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
                className="w-8 h-8 rounded-full mr-3 self-end"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="User Avatar"
              />
            )}

            <div
              className={`rounded-lg p-3 shadow max-w-xs ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "me" && (
              <img
                className="w-8 h-8 rounded-full ml-3 self-end"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="User Avatar"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
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