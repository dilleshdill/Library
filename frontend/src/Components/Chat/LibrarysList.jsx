import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function LibrarysList() {
  const [librariesList, setLibrariesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoading(true);
        
        // Get receiver ID from email
        const receiver = localStorage.getItem("email");
        const registerRes = await axios.get(`http://localhost:5002/api/auth/getid/${receiver}`);
        const receiverId = registerRes.data.user._id;

        // Get libraries list
        const response = await axios.get("http://localhost:5002/library/getlist");
        const libraries = response.data.library || [];

        // Get existing chats for this user
        const existingChatsRes = await axios.get(`http://localhost:5002/chat/${receiverId}`);
        const existingChats = existingChatsRes.data.chats || [];

        // Process libraries and find/create chats
        const processedLibraries = await Promise.all(
          libraries.map(async (lib) => {
            // Check if chat already exists
            const existingChat = existingChats.find(chat => 
              chat.members.includes(lib.admin) && chat.members.includes(receiverId)
            );

            if (existingChat) {
              return {
                libraryId: lib._id,
                name: lib.name,
                adminId: lib.admin,
                chatId: existingChat._id,
                senderId: lib.admin,
                receiverId: receiverId,
              };
            }

            // Create new chat if none exists
            try {
              const chatRes = await axios.post("http://localhost:5002/chat", {
                senderId: lib.admin,
                receiverId: receiverId,
              });
              
              return {
                libraryId: lib._id,
                name: lib.name,
                adminId: lib.admin,
                chatId: chatRes.data.chat._id,
                senderId: lib.admin,
                receiverId: receiverId,
              };
            } catch (err) {
              console.error(`Failed to create chat for library ${lib.name}:`, err.message);
              return null;
            }
          })
        );

        // Filter out failed entries
        const successfulLibraries = processedLibraries.filter(Boolean);
        setLibrariesList(successfulLibraries);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  if (loading) {
    return <div className="p-4">Loading libraries...</div>;
  }

  return (
    <div className="w-full md:w-1/4 p-4 bg-white shadow-lg overflow-y-auto sm:w-3/4 lg:w-1/4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Libraries</h2>
      <div className="space-y-4">
        {librariesList.map((library) => (
          <div
            key={library.chatId}
            className={`p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
              id === library.chatId ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => navigate(`/userchat/${library.chatId}`)}
          >
            <div className="font-semibold text-sm md:text-base">{library.name}</div>
            <div className="text-xs text-gray-500">Chat with admin</div>
          </div>
        ))}
      </div>
    </div>
  );
}