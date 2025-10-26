
import UserHeader from "../UserHeader";
import UsersList from "./UsersList";
import ChatMessagesAdmin from "./ChatMessagesAdmin";





export default function AdminSelectedChatApp() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <UserHeader />
        {/* Desktop View */}
      <div className="hidden md:flex flex-row w-screen h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <UsersList/>
        <ChatMessagesAdmin/>
      </div>
      {/* Mobile View */}
      <div className="md:hidden flex flex-row w-screen h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <ChatMessagesAdmin/>
      </div>
    </div>
  );
}
