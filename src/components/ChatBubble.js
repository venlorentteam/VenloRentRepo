import React from "react";
import "./ChatBubble.css";

/**
 * Props:
 * - text: string (message text)
 * - time: string (e.g. "10:24 AM")
 * - variant: "me" | "other" (determines alignment & color)
 */
const ChatBubble = ({ text, time, variant = "other" }) => {
const isMe = variant === "me";

  return (
    <div className={`chat-row ${isMe ? "chat-row--me" : "chat-row--other"}`}>
      <div className={`chat-bubble ${isMe ? "chat-bubble--me" : "chat-bubble--other"}`}>
        <div className="chat-bubble__text">{text}</div>
        <div className="chat-bubble__time">{time}</div>
      </div>
    </div>
  );
};

export default ChatBubble;
