import React from "react";
import "./MessageListItem.css";
import { FaChevronRight } from "react-icons/fa";

const MessageListItem = ({
  avatar,
  name,
  lastMessage,
  timeAgo,
  unread = false,
  onClick,
}) => {
  return (
    <div className={`message-list-item ${unread ? "unread" : ""}`} onClick={onClick}>
      <img src={avatar} alt={`${name}'s avatar`} className="message-avatar" />

      <div className="message-info">
        <div className="message-name-wrapper">
          <span className="message-name">{name}</span>
          {unread && <span className="unread-dot" />}
        </div>
        <div className="message-snippet">
          {lastMessage} <span className="message-time">• {timeAgo}</span>
        </div>
      </div>

      <FaChevronRight className="message-options" />
    </div>
  );
};

export default MessageListItem;
