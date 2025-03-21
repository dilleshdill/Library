import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const userId = "67c1fc23d5acdd3f5e2c1371";

        // Fetch conversations
        const response = await axios.get(`http://localhost:5002/chat/${userId}`);

        // Extract members and corresponding chatId excluding the current userId
        const filteredMembers = response.data.map(chat => ({
          chatId: chat._id,
          memberId: chat.members.find(member => member !== userId),
        }));

        // Fetch user details for each member
        const userDetails = await Promise.all(
          filteredMembers.map(async ({ memberId }) => {
            const res = await axios.get(`http://localhost:5002/api/auth/${memberId}`);
            return res.data;
          })
        );

        // Map user details with chatId
        const formattedUsers = userDetails.map((user, index) => ({
          id: filteredMembers[index].chatId, // Use chatId instead of user._id
          name: user.username,
          email: user.email,
        }));

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
            key={user.id}
            className={`p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
              id === user.id ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => {navigate(`/adminchat/${user.id}`);sendUserList(formattedUsers)}}
          >
            <div className="font-semibold text-sm md:text-base">{user.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}