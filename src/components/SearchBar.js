import React, { useState } from "react";
import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";
import { IoSend } from "react-icons/io5"; // For message mode

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  mode = "search", // 'search' or 'message'
  disabled = false
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch && mode === "search") {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
      if (mode === "message") {
        setQuery(""); // Clear input after sending message
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`search-bar ${mode === "message" ? "message-mode" : ""}`}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        aria-label={mode === "message" ? "Type a message" : "Search"}
      />
      <button 
        className="search-button" 
        onClick={handleSubmit}
        disabled={disabled || (mode === "message" && !query.trim())}
        aria-label={mode === "message" ? "Send message" : "Search"}
      >
        {mode === "message" ? <IoSend /> : <FiSearch />}
      </button>
    </div>
  );
};

export default SearchBar;