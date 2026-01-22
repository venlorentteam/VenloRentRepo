import React from "react";
import "./MessageListItem.css";
import { FaChevronRight } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const MessageListItem = ({
  avatar = "https://i.pravatar.cc/100",
  name = "Username",
  verified = false,
  lastMessage = "Last message preview...",
  timeAgo = "2m ago",
  unread = false,
  onClick,
}) => {
  return (
    <div 
      className={`message-list-item ${unread ? "message-unread" : ""}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Avatar */}
      <img 
        src={avatar} 
        alt={`${name}'s avatar`} 
        className="message-avatar" 
      />

      {/* Message Info */}
      <div className="message-content">
        <div className="message-header">
          <div className="message-name-row">
            <span className="message-name">{name}</span>
            {verified && (
              <RiVerifiedBadgeFill 
                className="message-verified" 
                aria-label="Verified" 
              />
            )}
          </div>
          {unread && <span className="message-unread-dot" aria-label="Unread message" />}
        </div>
        
        <div className="message-preview">
          <span className="message-text">{lastMessage}</span>
          <span className="message-time"> • {timeAgo}</span>
        </div>
      </div>

      {/* Arrow Icon */}
      <FaChevronRight className="message-chevron" aria-hidden="true" />
    </div>
  );
};

export default MessageListItem;