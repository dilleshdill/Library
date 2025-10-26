
import UserHeader from "../UserHeader";
import LibrarysList from "./LibrarysList";
import ChatMessages from "./ChatMessages";





export default function UserSelectedChat() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <UserHeader />
        {/* Desktop View */}
      <div className="hidden md:flex flex-row w-screen h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <LibrarysList/>
        <ChatMessages />
      </div>
      {/* Mobile View */}
      <div className="md:hidden flex flex-row w-screen h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <ChatMessages />
      </div>
    </div>
  );
}
