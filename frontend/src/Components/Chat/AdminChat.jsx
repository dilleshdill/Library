import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:5000/messages/${selectedUser}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (message.trim() && selectedUser) {
      const msgData = { sender: "admin", receiver: selectedUser, message };
      socket.emit("sendMessage", msgData);
      setMessages([...messages, msgData]);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Admin Chat</h2>
      <h3>Select a User</h3>
      {users.map((user) => (
        <button key={user} onClick={() => setSelectedUser(user)}>
          {user}
        </button>
      ))}
      
      {selectedUser && (
        <div>
          <h3>Chat with {selectedUser}</h3>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "admin" ? "admin-message" : "user-message"}>
                <b>{msg.sender}:</b> {msg.message}
              </div>
            ))}
          </div>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
