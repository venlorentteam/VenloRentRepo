import React, { useState } from "react";
import "./SearchBar.css";
import { FiSearch } from "react-icons/fi"; // using react-icons

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      <button className="search-icon" onClick={() => onSearch?.(query)}>
        <FiSearch />
      </button>
    </div>
  );
};

export default SearchBar;
