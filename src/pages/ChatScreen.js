import React from "react";
import {ChatBubble, MessageInputBar} from "../exports";
import "./ChatScreen.css";

const ChatScreen = () => {
  const messages = [
    { id: 1, message: "howfa guy👋", isUser: "other" },
    { id: 2, message: "Hi! How’s your day going?", isUser: "me" },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: "other" },
    { id: 4, message: "I ahve ggist oh", isUser: "me" },
    { id: 2, message: "oya spill?", isUser: "other" },
    { id: 1, message: "okay so yea,Ogunbanwo has about 4 children or so ...Funmto is a Therapist, Funmbi is a Movie Producer, Larkin is a photographer, and Layo, she's an entrepreneur or so. Met her just once👋", isUser: "other" },
    { id: 5, message: "Yeah bro, Its supposed to be the logo, but we dont have a logo yet… so nothing is rendered in place of it. But I wrote css styles to control the placement", isUser: "me" },
    { id: 3, message: "Pretty good, just finishing some code 😄", isUser: "me" },
  ];

  return (
    <>
    <div className="chat-screen">
      <div className="chat-container">
        {messages.map((msg) => (
          <ChatBubble text = {msg.message} time = "12.49pm" variant = {msg.isUser} />
        ))}
      </div>
       <MessageInputBar placeholder="Message..." variant="message" />
    </div>
   
    </>
  );
};

export default ChatScreen;
