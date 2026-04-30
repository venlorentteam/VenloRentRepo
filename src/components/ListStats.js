import React from "react";
import "./ListStats.css";
import { timeAgo } from "./Time";

const ListStats = ({ 
  stats,
  listings = [],
  followers = 0,
  following = 0,
  joinedAt = null,
}) => {
  const resolvedStats = stats?.length
    ? stats
    : [
        { label: "Properties Listed", value: String(listings.length) },
        { label: "Followers", value: String(followers) },
        { label: "Following", value: String(following) },
        { label: "Joined", value: joinedAt ? timeAgo(joinedAt) : "-" },
      ]

  return (
    <div className="list-stats-container">
      {resolvedStats.map((item, index) => (
        <div className="list-stat-item" key={index}>
          <h3 className="list-stat-value">{item.value}</h3>
          <p className="list-stat-label">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ListStats;
