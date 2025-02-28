const AdminChatView = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
  
    useEffect(() => {
      // Fetch all chats for the admin
      fetch("/chat/admin")
        .then((res) => res.json())
        .then((data) => setChats(data));
    }, []);
  
    return (
      <div>
        <div>
          <h2>Chats</h2>
          {chats.map((chat) => (
            <div key={chat._id} onClick={() => setSelectedChat(chat._id)}>
              {chat.userId}
            </div>
          ))}
        </div>
        {selectedChat && <ChatWindow chatId={selectedChat} />}
      </div>
    );
  };