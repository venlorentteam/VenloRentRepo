import React, { useState } from "react";
import "./MessageInputBar.css";
import { FaMicrophone, FaRegImage, FaCamera, FaRegCommentDots, FaPaperPlane } from "react-icons/fa";

const MessageInputBar = ({
  // Default placeholder text
  placeholder = "Message...",
  // Determines whether the bar is for messages or comments
  variant = "message", // or "comment"
}) => {
  // Local state to store the text user is typing
  const [message, setMessage] = useState("");

  // Function to handle sending messages
  const handleSend = () => {
    if (message.trim()) {
      alert(`📩 Sent: ${message}`); // For now, just shows an alert (can be replaced with real send logic)
      setMessage(""); // Clears the input after sending
    }
  };

  // Allows pressing Enter to send the message instead of clicking the icon
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) handleSend();
  };

  // Handles voice note icon click
  const handleVoiceNote = () => alert("🎤 Voice note recording started...");

  // Handles image upload icon click
  const handleUploadImage = () => alert("🖼️ Image upload clicked...");

  // Handles camera icon click
  const handleOpenCamera = () => alert("📷 Camera opened...");

  // Handles comment send (used when variant === 'comment')
  const handleComment = () => {
    if (message.trim()) {
      alert("💬 Comment added: " + message);
      setMessage(""); // Clear the input after commenting
    }
  };

  return (
    <div className="message-input-bar">
      {/* Input field for typing message or comment */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Updates state with each keystroke
        onKeyDown={handleKeyDown} // Sends message when pressing Enter
        placeholder={placeholder}
        className="message-input"
      />

      {/* Right-side icon section */}
      <div className="message-icons">
        {/* If user has typed something → show Send icon */}
        {message.trim() ? (
          <FaPaperPlane
            className="icon send-icon"
            title="Send message"
            onClick={handleSend}
          />
        ) : variant === "message" ? (
          <>
            {/* Default icons when input is empty (for chat type) */}
            <FaMicrophone
              className="icon"
              title="Record voice note"
              onClick={handleVoiceNote}
            />
            <FaRegImage
              className="icon"
              title="Upload image"
              onClick={handleUploadImage}
            />
            <FaCamera
              className="icon"
              title="Take photo"
              onClick={handleOpenCamera}
            />
          </>
        ) : (
          // If this is a comment bar instead of chat input
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
