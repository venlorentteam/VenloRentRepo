import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageListItem, SearchBar, ChatScreen, PageSetup, Header } from "../exports";
import { FaRegBell } from 'react-icons/fa';
import { RiSearchLine } from 'react-icons/ri';
import "./Inbox.css";

const dummyMessages = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/100?img=5",
    name: "Obinabo Williams",
    verified: true,
    lastMessage: "Hey, are you still coming today?",
    timeAgo: "10m",
    unread: true,
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/100?img=8",
    name: "Jay Carlos",
    verified: false,
    lastMessage: "Howfa na",
    timeAgo: "1h",
    unread: false,
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/100?img=12",
    name: "Wally White",
    verified: true,
    lastMessage: "Got it, see you soon!",
    timeAgo: "3h",
    unread: true,
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/100?img=14",
    name: "David King",
    verified: true,
    lastMessage: "Let's meet later",
    timeAgo: "1d",
    unread: false,
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/100?img=15",
    name: "Zara Femi",
    verified: false,
    lastMessage: "Got your update!",
    timeAgo: "2d",
    unread: true,
  },
];

const Inbox = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState(dummyMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(dummyMessages);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resizing to adapt mobile/desktop layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter messages based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter((msg) =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages]);

  // Handle chat selection
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    
    // Mark as read
    setMessages(prev => 
      prev.map(msg => 
        msg.id === chat.id ? { ...msg, unread: false } : msg
      )
    );

    // On mobile, navigate to chat screen
    if (isMobile) {
      navigate(`/chat/${chat.id}`, { state: { chat } });
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // If mobile and a chat is selected → show chat only (handled by navigation)
  // This component now only shows the inbox list on mobile

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Messages</h2>}
        icons={[
          { link: "/notifications", element: <FaRegBell /> }
        ]}
      />
      
      <div className="main-content">
        <div className="content">
          <div className="inbox-layout">
            {/* Left Panel: Message List */}
            <div className={`inbox-sidebar ${selectedChat && !isMobile ? 'has-selection' : ''}`}>
              {/* Search Bar */}
              <div className="inbox-search">
                <SearchBar 
                  placeholder="Search messages..." 
                  onSearch={handleSearch}
                />
              </div>

              {/* Message List */}
              <div className="inbox-message-list">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <MessageListItem
                      key={msg.id}
                      {...msg}
                      onClick={() => handleSelectChat(msg)}
                    />
                  ))
                ) : (
                  <div className="inbox-empty-search">
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Chat Screen / Placeholder */}
            {!isMobile && (
              <div className="inbox-chat-panel">
                {selectedChat ? (
                  <ChatScreen 
                    chat={selectedChat} 
                    onBack={() => setSelectedChat(null)}
                  />
                ) : (
                  <div className="inbox-empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>Your Messages</h3>
                    <p>Select a conversation to start chatting</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageSetup>
  );
};

export default Inbox;