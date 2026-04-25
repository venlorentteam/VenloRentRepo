import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ChatBubble, SearchBar } from "../exports";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import "./ChatScreen.css";

const BASE_URL = "https://newprojectbackend-5axx.onrender.com";

const ChatScreen = ({ chat: propChat, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const chat = propChat || location.state?.chat;

  // === Removed hardcoded demo messages ===
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // === Fetch real messages when the conversation is opened ===
  useEffect(() => {
    if (!chat?.conversationId) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${BASE_URL}/conversations/${chat.conversationId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Determine our own userId so we can set variant correctly
        let myId = null;
        try {
          myId = JSON.parse(atob(token.split(".")[1]))?.id;
        } catch (_) {}

        const mapped = (res.data.messages || []).map((msg) => ({
          id: msg._id,
          text: msg.text,
          variant: String(msg.sender?._id || msg.sender) === String(myId) ? "me" : "other",
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Could not load messages.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chat?.conversationId]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Send message: optimistic UI + persist to DB ===
  const handleSendMessage = async (newMessage) => {
    if (!newMessage.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const timeString = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Optimistic update — show immediately before the request resolves
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      text: newMessage,
      variant: "me",
      time: timeString,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await axios.post(
        `${BASE_URL}/conversations/${chat.conversationId}/messages`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace the optimistic message with the real one from the server
      const saved = res.data.message;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id
            ? {
                id: saved._id,
                text: saved.text,
                variant: "me",
                time: new Date(saved.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
              }
            : m
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      // Roll back the optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/inbox");
    }
  };

  if (!chat) {
    return (
      <div className="chat-error">
        <p>No conversation selected</p>
        <button onClick={() => navigate("/inbox")}>Back to Inbox</button>
      </div>
    );
  }

  return (
    <div className="chat-screen">
      {/* Chat Header */}
      <div className="chat-header">
        <button className="chat-back-btn" onClick={handleBack} aria-label="Go back">
          <FaArrowLeft />
        </button>

        <div className="chat-user-info">
          <img src={chat.avatar} alt={chat.name} className="chat-user-avatar" />
          <div className="chat-user-details">
            <div className="chat-user-name-row">
              <span className="chat-user-name">{chat.name}</span>
              {chat.verified && <RiVerifiedBadgeFill className="chat-verified-badge" />}
            </div>
            <span className="chat-user-status">Active now</span>
          </div>
        </div>

        <button className="chat-menu-btn" aria-label="More options">
          <FaEllipsisV />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages-container">
        {isLoading && (
          <div className="chat-loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`skeleton skeleton-bubble ${i % 2 === 0 ? "left" : "right"}`} />
            ))}
          </div>
        )}

        {error && <p className="chat-error-text">{error}</p>}

        {!isLoading &&
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              text={msg.text}
              time={msg.time}
              variant={msg.variant}
              avatar={chat.avatar}
            />
          ))}

        {isTyping && (
          <div className="chat-typing-indicator">
            <img src={chat.avatar} alt="" className="typing-avatar" />
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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