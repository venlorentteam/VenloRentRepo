import React, { useState, useEffect } from "react";
import { MessageListItem, SearchBar, ChatScreen } from "../exports";
import "./Inbox.css";

const dummyMessages = [
  {
    avatar: "https://i.pravatar.cc/100?img=5",
    name: "Obinabo Williams",
    lastMessage: "Hey, are you still coming today?",
    timeAgo: "10 mins ago",
    unread: true,
  },
  {
    avatar: "https://i.pravatar.cc/100?img=8",
    name: "Jay Carlos",
    lastMessage: "Howfa na",
    timeAgo: "1 hr ago",
    unread: false,
  },
  {
    avatar: "https://i.pravatar.cc/100?img=12",
    name: "Wally White",
    lastMessage: "Got it, see you soon!",
    timeAgo: "3 hr ago",
    unread: true,
  },
  {
    avatar: "https://i.pravatar.cc/100?img=14",
    name: "David King",
    lastMessage: "Let’s meet later",
    timeAgo: "1 hr ago",
    unread: false,
  },
  {
    avatar: "https://i.pravatar.cc/100?img=15",
    name: "Zara Femi",
    lastMessage: "Got your update!",
    timeAgo: "2 hr ago",
    unread: true,
  },
];

const Inbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resizing to adapt mobile/desktop layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function when a chat item is clicked
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  // If mobile and a chat is selected → show chat only
  if (isMobile && selectedChat) {
    return <ChatScreen chat={selectedChat} onBack={() => setSelectedChat(null)} />;
  }

  return (
    <div className="inbox-container">
      {/* Left panel: Inbox list */}
      <div className="inbox-sidebar">
        <SearchBar placeholder="Search messages..." />
        <div className="message-list">
          {dummyMessages.map((msg, index) => (
            <MessageListItem
              key={index}
              {...msg}
              onClick={() => handleSelectChat(msg)}
            />
          ))}
        </div>
      </div>

      {/* Right panel: Chat screen / placeholder */}
      {!isMobile && (
        <div className="inbox-chat-panel">
          {selectedChat ? (
            <ChatScreen chat={selectedChat} />
          ) : (
            <div className="empty-chat">
              <h2>Your Messages</h2>
              <p>Send a message to start a chat.</p>
              <button className="send-msg-btn">Send Message</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
