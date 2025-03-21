import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default function ChatMessages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { id } = useParams();
  const userId = "67c1fc23d5acdd3f5e2c1371"; // Current user ID (replace with dynamic value)

  const messagesEndRef = useRef(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages for the current chat
  useEffect(() => {
    const getMessages = async () => {
      try {
        const chatId = id;
        const res = await axios.get(`http://localhost:5002/chat/${chatId}`);
        console.log("Chat details:", res.data);
        const response = await axios.get(`http://localhost:5002/message/${id}`);
        setMessages(response.data); // Store messages in state
        scrollToBottom(); // Scroll to the latest message
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

  // Send a new message
  const sendMessage = async () => {
    if (!text.trim()) return; // Prevent sending empty messages

    try {
      const newMessage = {
        chatId: id, // Ensure chatId is correct
        senderId: userId,
        text,
      };

      const response = await axios.post(
        "http://localhost:5002/message",
        newMessage
      );

      // Update UI immediately (Optimistic Update)
      setMessages((prev) => [...prev, response.data]);
      setText(""); // Clear input after sending

      scrollToBottom(); // Scroll to the latest message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Display Section */}
      <div className="flex-1 overflow-y-scroll p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== userId && (
              <img
                className="w-10 h-10 rounded-full mr-3"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="User Avatar"
              />
            )}

            <div
              className={`rounded-xl p-4 shadow-md max-w-lg ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {msg.text}
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

      {/* Message Input Section */}
      <div className="bg-gray-100 px-6 py-4 w-full shadow-lg">
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
            onClick={sendMessage}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
}