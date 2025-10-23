import React, { useState } from "react";
import { ChatBubble, MessageInputBar } from "../exports";
import { FaArrowLeft } from "react-icons/fa";
import "./ChatScreen.css";

const ChatScreen = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, message: "howfa guy👋", isUser: "other" },
    { id: 2, message: "Hi! How's your day going?", isUser: "me" },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: "other" },
    { id: 4, message: "I ahve ggist oh", isUser: "me" },
    { id: 5, message: "oya spill?", isUser: "other" },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: "other" },
    { id: 4, message: "I ahve ggist oh", isUser: "me" },
    { id: 5, message: "oya spill?", isUser: "other" },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: "other" },
    { id: 4, message: "I ahve ggist oh", isUser: "me" },
    { id: 5, message: "oya spill?", isUser: "other" },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: "other" },
    { id: 4, message: "I ahve ggist oh", isUser: "me" },
    { id: 5, message: "oya spill?", isUser: "other" },
  ]);

  // Handle sending a new message
  const handleSendMessage = (newMessage) => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      message: newMessage,
      isUser: "me",
    };
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="chat-screen">
      {/* Chat Header */}
      <div className="chat-header">
        {/* Mobile back button */}
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            <FaArrowLeft />
          </button>
        )}
        {/* Avatar + Name */}
        {chat && (
          <div className="chat-user-info">
            <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
            <div className="chat-user-texts">
              <span className="chat-user-name">{chat.name}</span>
              <span className="chat-username">Active now</span> {/* for now i ust used active now, but it should be replace with the user handle of the user */}
            </div>
          </div>
        )}
      </div>

      {/* Chat messages */}
      <div className="chat-container">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            text={msg.message}
            time="12:49 PM"
            variant={msg.isUser}
            avatar={chat?.avatar}
          />
        ))}
      </div>

      {/* Input bar */}
      <MessageInputBar
        placeholder="Message..."
        variant="message"
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatScreen;
