import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [userId, setUserId] = useState(localStorage.getItem("email"));
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [adminId] = useState("admin"); // Admin's ID
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
      
      axios.get(`http://localhost:5000/messages/${userId}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Error fetching messages:", err));
    }

    const receiveMessageHandler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { sender: userId, receiver: adminId, message };
      socket.emit("sendMessage", msgData);
      setMessages([...messages, msgData]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat with Admin</h2>

      {!userId ? (
        <div>
          <input type="text" placeholder="Enter User ID" onChange={(e) => setUserId(e.target.value)} />
          <button onClick={() => socket.emit("register", userId)}>Join</button>
        </div>
      ) : (
        <div>
          <h3>Chatting as: {userId}</h3>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === userId ? "user-message" : "admin-message"}>
                <b>{msg.sender}:</b> {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
