import React from "react";
import "./ListStats.css";

const ListStats = ({ stats = [] }) => {
  return (
    <div className="list-stats">
      {stats.map((item, index) => (
        <div className="stat-item" key={index}>
          <h3>{item.value}</h3>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ListStats;
