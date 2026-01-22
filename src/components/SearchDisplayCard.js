import React from "react";
import "./SearchDisplayCard.css";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const SearchDisplayCard = ({
  username = "@username",
  verified = false,
  price = "₦1,200,000",
  location = "Ikoyi, Lagos",
  orders = 245,
  successRate = "90%",
  houseType = "Apartment",
  imageUrl,
  isAd = false,
  onClick,
}) => {
  return (
    <div className="search-display-card" onClick={onClick} role="button" tabIndex={0}>
      {/* Left Section */}
      <div className="search-card-left">
        <div className="search-user-row">
          <span className="search-username">
            {username}
            {verified && <RiVerifiedBadgeFill className="search-verified" />}
          </span>
          {isAd && <span className="search-ad-badge">Ad</span>}
        </div>

        <h3 className="search-price">{price}</h3>

        <div className="search-meta">
          <p className="search-location">{location}</p>
          <p className="search-stats">
            {orders} orders • {successRate} success
          </p>
          <p className="search-type">{houseType}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="search-card-right">
        {imageUrl ? (
          <img src={imageUrl} alt={houseType} className="search-image" />
        ) : (
          <div className="search-image-placeholder">
            <HiOutlinePhotograph aria-hidden="true" />
          </div>
        )}
        <FaChevronRight className="search-arrow" aria-hidden="true" />
      </div>
    </div>
  );
};
export default SearchDisplayCard;