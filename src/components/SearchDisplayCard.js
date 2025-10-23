import React from "react";
import "./SearchDisplayCard.css";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";

const SearchDisplayCard = ({
  username = "@username",
  price = "₦1,200,000",
  location = "Ikoyi, Lagos",
  orders = 245,
  successRate = "90%",
  houseType = "Apartment",
  imageUrl,
}) => {
  return (
    <div className="search-card">
      {/* Left Section */}
      <div className="search-card-left">
        <div className="user-row">
          <span className="username">{username}</span>
          <span className="ad-tag">Ad</span>
        </div>

        <h2 className="price">{price}</h2>

        <div className="location">
          <span className="label">Location </span>
          <span className="value">{location}</span>
        </div>

        <div className="orders">
          <span className="label">Orders </span>
          <span className="value">
            {orders} | {successRate}
          </span>
        </div>

        <div className="house-type">| {houseType}</div>
      </div>

      {/* Right Section */}
      <div className="search-card-right">
        {imageUrl ? (
          <img src={imageUrl} alt={houseType} className="house-image" />
        ) : (
          <div className="image-placeholder">
            <HiOutlinePhotograph className="placeholder-icon" />
          </div>
        )}
        <FaChevronRight className="arrow-icon" />
      </div>
    </div>
  );
};

export default SearchDisplayCard;
