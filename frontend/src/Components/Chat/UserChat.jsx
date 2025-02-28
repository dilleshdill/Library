import { useState } from "react";
import UserHeader from "../UserHeader";
export default function ChatApp() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, how can I help you?", sender: "other" },
    { id: 2, text: "Sure, I can help with that.", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { id: messages.length + 1, text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center">
        <UserHeader/>
      {/* Chat Container */}
      <div className="bg-gray-200 flex-1 overflow-y-scroll p-4 w-screen ">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4 w-full">
            {msg.sender === "other" ? (
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <img
                    className="w-8 h-8 rounded-full mr-2"
                    src="https://picsum.photos/50/50"
                    alt="User Avatar"
                  />
                  <div className="font-medium">John Doe</div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow max-w-lg w-auto">{msg.text}</div>
              </div>
            ) : (
              <div className="flex items-center justify-end w-full">
                <div className="bg-blue-500 text-white rounded-lg p-2 shadow max-w-lg w-auto mr-2">
                  {msg.text}
                </div>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://picsum.photos/50/50"
                  alt="User Avatar"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-gray-100 px-4 py-2 w-full ">
        <div className="flex items-center w-full">
          <input
            className="w-full border rounded-full py-2 px-4 mr-2"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="!bg-blue-500 hover:!bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
