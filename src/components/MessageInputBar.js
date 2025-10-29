import React, { useState } from "react";
import "./MessageInputBar.css";
import {
  FaMicrophone,
  FaImage,
  FaCamera,
  FaRegCommentDots,
  FaPaperPlane,
} from "react-icons/fa";
import {HiOutlineMicrophone} from 'react-icons/hi'
import {IoImageOutline, IoCameraOutline} from 'react-icons/io5'
const MessageInputBar = ({
  placeholder = "Message...",
  variant = "message", // or "comment"
  onSend, // <-- new prop from ChatScreen
}) => {
  const [message, setMessage] = useState("");

  // Handle sending messages (via prop if provided)
  const handleSend = () => {
    if (!message.trim()) return;

    if (onSend) {
      onSend(message); // 🔹 send message up to parent (ChatScreen)
    } else {
      alert(`📩 Sent: ${message}`); // fallback if no prop passed
    }

    setMessage(""); // clear input
  };

  // Allow Enter key to trigger send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  // Other icons (optional placeholders)
  const handleVoiceNote = () => alert("🎤 Voice note recording started...");
  const handleUploadImage = () => alert("🖼️ Image upload clicked...");
  const handleOpenCamera = () => alert("📷 Camera opened...");

  const handleComment = () => {
    if (message.trim()) {
      if (onSend) onSend(message);
      else alert("💬 Comment added: " + message);
      setMessage("");
    }
  };

  return (
    <div className="message-input-bar">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="message-input"
      />

      <div className="message-icons">
        {message.trim() ? (
          <FaPaperPlane
            className="icon send-icon"
            title="Send message"
            onClick={handleSend}
          />
        ) : variant === "message" ? (
          <>
            <HiOutlineMicrophone
              className="icon"
              title="Record voice note"
              onClick={handleVoiceNote}
            />
            <IoImageOutline
              className="icon"
              title="Upload image"
              onClick={handleUploadImage}
            />
            <IoCameraOutline
              className="icon"
              title="Take photo"
              onClick={handleOpenCamera}
            />
          </>
        ) : (
          <FaRegCommentDots
            className="icon"
            title="Add comment"
            onClick={handleComment}
          />
        )}
      </div>
    </div>
  );
};

export default MessageInputBar;
