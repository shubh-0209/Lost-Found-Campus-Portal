import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">
  <img
    src={item.image || "https://via.placeholder.com/300"}
    alt={item.title}
    className="item-image"
  />

  <div className="item-content">
    <div className="item-title">{item.title}</div>

    <div className="item-meta">
      {item.category} • {item.location}
    </div>

    <span
      className={`badge ${
        item.status === "lost" ? "badge-lost" : "badge-found"
      }`}
    >
      {item.status.toUpperCase()}
    </span>

    <button className="view-btn">
      View Details
    </button>
  </div>
</div>
  );
};

export default ItemCard;