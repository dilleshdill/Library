import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  // const [userId,setUserId] = useState(""); // Current user ID (replace with dynamic value)
  useEffect(() => {
    const getConversations = async () => {
      try {
        const libId = localStorage.getItem("libraryId");

        const user =  await axios.get(`http://localhost:5002/library/${libId}`);
        console.log("User details:", user.data.admin._id);
        // setUserId(user.data.admin._id)
        const userId = user.data.admin._id; // Replace with the actual user ID you want to use
        console.log("User ID:", userId);
        // Fetch conversations
        const response = await axios.get(`http://localhost:5002/chat/${userId}`);
        console.log("Conversations:", response.data);

        // Extract members and corresponding chatId excluding the current userId
        const filteredMembers = response.data.map(chat => ({
          chatId: chat._id,
          memberId: chat.members.find(member => member !== userId),
        }));
        console.log("Filtered members:", filteredMembers);

        // Fetch user details for each member
        const userDetails = await Promise.all(
          filteredMembers.map(async ({ memberId }) => {
            const res = await axios.get(`http://localhost:5002/api/auth/byid/${memberId}`);
            // console.log("User details:", res.data);
            return res.data;
          })
        );
        console.log("User details:", userDetails);
        // Map user details with chatId
        const formattedUsers = userDetails.map((user, index) => ({
          chatId: filteredMembers[index].chatId, // Use chatId for navigation
          name: user.user.username,          // Corrected
          email: user.user.email             // Corrected
        }));
        console.log("Formatted users:", formattedUsers);        

        setUsersList(formattedUsers);
        console.log(formattedUsers)

      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    getConversations();
  }, []);

  return (
    <div className="w-full md:w-1/4 p-4 bg-white shadow-lg overflow-y-auto sm:w-3/4 lg:w-1/4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Users</h2>
      <div className="space-y-4">
        {usersList.map((user) => (
          <div
            key={user.chatId}
            className={`p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
              id === user.chatId ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => {navigate(`/adminchat/${user.chatId}`);sendUserList(formattedUsers)}}
          >
            <div className="font-semibold text-sm md:text-base">{user.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}