import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data));
  }, [id]);

  if (!item) return <p className="loading">Loading...</p>;

  return (
    <div className="details-container">

      <div className="details-card">

        {/* Image Section */}
        <div className="details-image">
          <img
            src={item.image || "https://via.placeholder.com/400"}
            alt={item.itemName}
          />
        </div>

        {/* Info Section */}
        <div className="details-info">

          <h1 className="details-title">{item.itemName}</h1>

          <span
            className={`details-badge ${
              item.type === "lost" ? "lost" : "found"
            }`}
          >
            {item.type.toUpperCase()}
          </span>

          <p className="details-meta">
            📂 <b>Category:</b> {item.category}
          </p>

          <p className="details-meta">
            📍 <b>Location:</b> {item.location}
          </p>

          <p className="details-meta">
            📅 <b>Date:</b>{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </p>

          <div className="details-desc">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <button className="contact-btn">
            Contact Owner
          </button>

        </div>

      </div>
    </div>
  );
};

export default ItemDetails;