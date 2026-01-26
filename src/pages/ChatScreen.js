import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChatBubble, SearchBar } from "../exports";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import "./ChatScreen.css";

const ChatScreen = ({ chat: propChat, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Get chat from props or location state (for mobile navigation)
  const chat = propChat || location.state?.chat;

  const [messages, setMessages] = useState([
    { id: 1, text: "howfa guy👋", variant: "other", time: "10:30 AM" },
    { id: 2, text: "Hi! How's your day going?", variant: "me", time: "10:31 AM" },
    { id: 3, text: "Pretty good, just finishing some code 😄", variant: "other", time: "10:32 AM" },
    { id: 4, text: "I have gist oh", variant: "me", time: "10:35 AM" },
    { id: 5, text: "oya spill?", variant: "other", time: "10:35 AM" },
    { id: 6, text: "So you know that property I told you about?", variant: "me", time: "10:36 AM" },
    { id: 7, text: "Yeah, the one in Lekki?", variant: "other", time: "10:36 AM" },
    { id: 8, text: "Yes! I finally got it 🎉", variant: "me", time: "10:37 AM" },
    { id: 9, text: "Congrats! When are you moving in?", variant: "other", time: "10:38 AM" },
    { id: 10, text: "Next month. Can't wait!", variant: "me", time: "10:39 AM" },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a new message
  const handleSendMessage = (newMessage) => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const msg = {
      id: Date.now(),
      text: newMessage,
      variant: "me",
      time: timeString,
    };

    setMessages((prev) => [...prev, msg]);

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response (optional)
      // const response = {
      //   id: Date.now() + 1,
      //   text: "Got it!",
      //   variant: "other",
      //   time: timeString,
      // };
      // setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/inbox');
    }
  };

  const handleMenuClick = () => {
    // Open options menu
    console.log('Open menu');
  };

  // If no chat data, show error
  if (!chat) {
    return (
      <div className="chat-error">
        <p>No conversation selected</p>
        <button onClick={() => navigate('/inbox')}>Back to Inbox</button>
      </div>
    );
  }

  return (
    <div className="chat-screen">
      {/* Chat Header */}
      <div className="chat-header">
        {/* Back Button */}
        <button 
          className="chat-back-btn" 
          onClick={handleBack}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>

        {/* User Info */}
        <div className="chat-user-info">
          <img 
            src={chat.avatar} 
            alt={chat.name} 
            className="chat-user-avatar" 
          />
          <div className="chat-user-details">
            <div className="chat-user-name-row">
              <span className="chat-user-name">{chat.name}</span>
              {chat.verified && (
                <RiVerifiedBadgeFill className="chat-verified-badge" />
              )}
            </div>
            <span className="chat-user-status">Active now</span>
          </div>
        </div>

        {/* Menu Button */}
        <button 
          className="chat-menu-btn" 
          onClick={handleMenuClick}
          aria-label="More options"
        >
          <FaEllipsisV />
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            text={msg.text}
            time={msg.time}
            variant={msg.variant}
            avatar={chat.avatar}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="chat-typing-indicator">
            <img 
              src={chat.avatar} 
              alt="" 
              className="typing-avatar" 
            />
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="chat-input-wrapper">
        <SearchBar
          placeholder="Type a message..."
          mode="message"
          onSearch={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatScreen;