import React from "react";
import "./ListStats.css";

const ListStats = ({ 
  stats = [
    { label: "Properties Listed", value: "24" },
    { label: "Orders Completed", value: "156" },
    { label: "Success Rate", value: "98%" },
    { label: "Followers", value: "1.2k" }
  ] 
}) => {
  return (
    <div className="list-stats-container">
      {stats.map((item, index) => (
        <div className="list-stat-item" key={index}>
          <h3 className="list-stat-value">{item.value}</h3>
          <p className="list-stat-label">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ListStats;