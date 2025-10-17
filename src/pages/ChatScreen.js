import React from "react";
import {ChatBubble} from "../exports";
import "./ChatScreen.css";

const ChatScreen = () => {
  const messages = [
    { id: 1, message: "Hey there! 👋", isUser: false },
    { id: 2, message: "Hi! How’s your day going?", isUser: true },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: false },
    { id: 4, message: "", isUser: true }, // audio placeholder
    { id: 5, message: "Haha nice! Send me a voice note.", isUser: false },
  ];

  return (
    <div className="chat-screen">
      <div className="chat-container">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.message} isUser={msg.isUser} />
        ))}
      </div>
    </div>
  );
};

export default ChatScreen;
