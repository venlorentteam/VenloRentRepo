import React, { useState } from "react";
import "./ChatBubble.css";

const ChatBubble = ({
  sender = "other", // "me" or "other"
  avatar,
  message,
  type = "text", // "text" | "image" | "audio"
  time = "12:45 PM",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => setIsPlaying((prev) => !prev);

  return (
    <div className={`chat-bubble-container ${sender}`}>
      {sender === "other" && avatar && (
        <img src={avatar} alt="avatar" className="chat-avatar" />
      )}

      <div className={`chat-bubble ${type}`}>
        {type === "text" && <p>{message}</p>}

        {type === "image" && (
          <img src={message} alt="sent media" className="chat-image" />
        )}

        {type === "audio" && (
          <div
            className={`audio-placeholder ${
              isPlaying ? "playing" : ""
            }`}
            onClick={toggleAudio}
          >
            <div className="play-button">▶</div>
            <div className="audio-wave" />
            <span>{isPlaying ? "Playing..." : "Tap to play"}</span>
          </div>
        )}

        <span className="chat-time">{time}</span>
      </div>

      {sender === "me" && avatar && (
        <img src={avatar} alt="avatar" className="chat-avatar" />
      )}
    </div>
  );
};

export default ChatBubble;
