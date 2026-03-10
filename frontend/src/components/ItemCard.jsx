import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">

      <img
        src={item.image || "https://via.placeholder.com/300"}
        alt={item.itemName}
        className="item-image"
      />

      <div className="item-content">

        <h3 className="item-title">
          {item.itemName}
        </h3>

        <div className="item-meta">
          {item.category} • 📍 {item.location}
        </div>

        <p className="item-desc">
          {item.description?.slice(0, 60)}...
        </p>

        <span
          className={`badge ${
            item.type === "lost" ? "badge-lost" : "badge-found"
          }`}
        >
          {item.type.toUpperCase()}
        </span>

        <div className="item-footer">

          <span className="item-date">
            📅 {new Date(item.createdAt).toLocaleDateString()}
          </span>

          <Link to={`/item/${item._id}`}>
            <button className="view-btn">
              View Details
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default ItemCard;