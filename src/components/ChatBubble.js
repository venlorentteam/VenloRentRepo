import React from "react";
import "./ChatBubble.css";

/**
 * ChatBubble Component
 * @param {string} text - Message text
 * @param {string} time - Timestamp (e.g. "10:24 AM")
 * @param {string} variant - "me" | "other" (determines alignment & color)
 * @param {string} avatar - Avatar URL for "other" messages
 */
const ChatBubble = ({ 
  text = "", 
  time = "", 
  variant = "other", 
  avatar = "https://i.pravatar.cc/100?img=5" 
}) => {
  const isMe = variant === "me";
  
  return (
    <div className={`chat-bubble-row ${isMe ? "chat-bubble-row--me" : "chat-bubble-row--other"}`}>
      {/* Avatar (only for other person) */}
      {!isMe && avatar && (
        <div className="chat-bubble-avatar">
          <img src={avatar} alt="Avatar" className="chat-bubble-avatar-img" />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`chat-bubble ${isMe ? "chat-bubble--me" : "chat-bubble--other"}`}>
        <p className="chat-bubble-text">{text}</p>
        <span className="chat-bubble-time">{time}</span>
      </div>
    </div>
  );
};

export default ChatBubble;