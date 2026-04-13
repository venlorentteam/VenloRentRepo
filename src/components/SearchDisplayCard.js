import React, { useState } from "react";
import "./SearchDisplayCard.css";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbHomeSearch } from "react-icons/tb";
import { LuBanknote, LuClock, LuMessageSquare } from "react-icons/lu";
import { MdOutlineBedroomParent } from "react-icons/md";
import { LuBuilding2 } from "react-icons/lu";

// ============================================================
//  SearchDisplayCard
//
//  Renders one result row in the search results list.
//  Handles two distinct layouts driven by the _type prop:
//    "listing" → shows cover photo, price, meta chips
//    "request" → no photo, shows description, budget, expiry
//
//  Props:
//    _type         "listing" | "request"   — controls layout variant
//    username      string    — agent/requester @handle
//    agentName     string    — agent/requester display name
//    imageUrl      string    — agent avatar URL (small circle)
//    coverImage    string    — listing cover photo URL (thumbnail)
//                             NOT passed for requests
//    verified      boolean   — shows verified badge on avatar
//    isAd          boolean   — shows "Ad" pill
//    title         string    — listing title (listings only)
//    price         string    — formatted price string e.g. "₦700,000/yr"
//    location      string    — "Town, State"
//    houseType     string    — property_type e.g. "apartment"
//    listingType   string    — "rent" | "sale" | "shortlet" (listings only)
//    bedrooms      string    — "1 Bed", "2 Bed" etc. (listings only)
//    orders        number    — completed orders count (listings)
//                             or response count (requests)
//    description   string    — request body text (requests only)
//    budget        string    — budget range (requests only)
//    responseCount number    — agent response count (requests only)
//    expired       boolean   — request expired state (requests only)
//    daysLeft      number    — days until expiry (requests only)
//    onClick       function  — card click handler
// ============================================================

const SearchDisplayCard = ({
  _type = "listing",
  username = "@username",
  agentName = "",
  imageUrl = "",       // agent avatar
  coverImage = "",       // property cover photo — listings only
  verified = false,
  isAd = false,
  title = "",
  price = "",
  location = "",
  houseType = "",
  listingType = "",
  bedrooms = "",
  orders = 0,
  description = "",
  budget = "",
  responseCount = 0,
  expired = false,
  daysLeft = null,
  onClick,
}) => {

  // ============================================================
  //  Image error fallback — if the cover photo URL is broken,
  //  we fall back to the placeholder rather than showing a
  //  broken image icon. Tracked in local state per card.
  // ============================================================
  const [imgError, setImgError] = useState(false);

  const isRequest = _type === "request";

  const listingTypeMod = {
    rent: "search-listing-pill--rent",
    sale: "search-listing-pill--sale",
    shortlet: "search-listing-pill--shortlet",
  }[listingType] ?? "";

  const listingTypeLabel = {
    rent: "For Rent",
    sale: "For Sale",
    shortlet: "Shortlet",
  }[listingType] ?? "";

  return (
    <div
      className={`search-display-card ${isRequest ? "search-display-card--request" : ""} ${expired ? "search-display-card--expired" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={isRequest ? `Request by ${agentName || username}` : title || houseType}
    >
      
      <div className="search-card-left">
        <div className="search-user-row">
          <div className="search-avatar-wrap">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={agentName || username}
                className="search-avatar"
              />
            ) : (
              // Initials fallback when no avatar URL is provided
              <div className="search-avatar search-avatar--initials" aria-hidden="true">
                {(agentName || username).replace("@", "").charAt(0).toUpperCase()}
              </div>
            )}
            {verified && (
              <RiVerifiedBadgeFill
                className="search-verified-overlay"
                aria-label="Verified agent"
              />
            )}
          </div>

          <div className="search-user-info">
            {agentName && (
              <span className="search-agent-name">{agentName}</span>
            )}
            <span className="search-username">{username}</span>
          </div>

          {/* Ad badge — top-right of user row */}
          {isAd && <span className="search-ad-badge">Ad</span>}

          {/* Request type badge — mirrors RequestCard's cyan pill */}
          {isRequest && (
            <span className="search-request-badge">
              <TbHomeSearch aria-hidden="true" />
              Request
            </span>
          )}
        </div>

        {!isRequest && (
          <>
            {title && (
              <h3 className="search-title">{title}</h3>
            )}

            <div className="search-price-row">
              <span className="search-price">{price}</span>
              {listingType && (
                <span className={`search-listing-pill ${listingTypeMod}`}>
                  {listingTypeLabel}
                </span>
              )}
            </div>

            <div className="search-meta">
              {location && (
                <p className="search-location">📍 {location}</p>
              )}

              <div className="search-chips">
                {bedrooms && (
                  <span className="search-chip">
                    <MdOutlineBedroomParent aria-hidden="true" />
                    {bedrooms}
                  </span>
                )}
                {houseType && (
                  <span className="search-chip">
                    <LuBuilding2 aria-hidden="true" />
                    {/* Capitalise first letter for display */}
                    {houseType.charAt(0).toUpperCase() + houseType.slice(1)}
                  </span>
                )}
              </div>

              {orders > 0 && (
                <p className="search-stats">{orders} orders completed</p>
              )}
            </div>
          </>
        )}

        {isRequest && (
          <>
            {description && (
              <p className="search-request-desc">
                {/* Truncate long descriptions to keep the card compact */}
                {description.length > 100
                  ? description.slice(0, 100) + "…"
                  : description}
              </p>
            )}

            <div className="search-chips">
              {budget && (
                <span className="search-chip search-chip--budget">
                  <LuBanknote aria-hidden="true" />
                  {budget}
                </span>
              )}
              {houseType && (
                <span className="search-chip">
                  <TbHomeSearch aria-hidden="true" />
                  {houseType}
                </span>
              )}
              {location && (
                <span className="search-chip">
                  📍 {location}
                </span>
              )}
            </div>

            <div className="search-request-footer">
              {responseCount > 0 && (
                <span className="search-response-count">
                  <LuMessageSquare aria-hidden="true" />
                  {responseCount} {responseCount === 1 ? "response" : "responses"}
                </span>
              )}

              <span className={`search-expiry ${expired ? "search-expiry--expired" : ""}`}>
                {expired ? (
                  "Expired"
                ) : daysLeft !== null ? (
                  <>
                    <LuClock aria-hidden="true" />
                    {" "}{daysLeft}d left
                  </>
                ) : (
                  "Open"
                )}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="search-card-right">
        {!isRequest && (
          <div className="search-image-wrap">
            {coverImage && !imgError ? (
              <img
                src={coverImage}
                alt={title || houseType}
                className="search-image"
                onError={() => setImgError(true)}
              />
            ) : (
              // Placeholder — shown when no coverImage or URL is broken
              <div className="search-image-placeholder" aria-hidden="true">
                <HiOutlinePhotograph />
              </div>
            )}
          </div>
        )}

        <FaChevronRight className="search-arrow" aria-hidden="true" />
      </div>

    </div>
  );
};

export default SearchDisplayCard;