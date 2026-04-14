import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const ItemCard = ({ item, currentUser }) => {
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  const title =
    item?.itemName && item.itemName.trim() !== ""
      ? item.itemName
      : "Unnamed Item";

  const hasImage = item?.image && item.image.trim() !== "";

  const imageUrl = hasImage
    ? item.image.startsWith("http")
      ? item.image
      : `${BACKEND_URL}/${item.image.replace(/\\/g, "/")}`
    : null;

  // ✅ 🔥 OWNER CHECK
  const isOwner =
  item?.createdBy?._id
    ? item.createdBy._id.toString() === currentUser?._id?.toString()
    : item?.createdBy?.toString() === currentUser?._id?.toString();
    // ⚠️ adjust "reportedBy" if your field name is different
    console.log("ITEM createdBy:", item?.createdBy);
console.log("USER id:", currentUser?._id);
// console.log("FULL ITEM:", item);

  return (
    <div className="card">
      {hasImage && (
        <div className="card-img-container">
          <img
            src={imageUrl}
            alt={title}
            className="card-img-blurred"
          />
          <div className="blur-overlay">{title}</div>
        </div>
      )}

      <div className="card-body">
        <h3 className="card-title">{title}</h3>

        <p className="card-meta">
          <strong>{item?.category || "Unknown"}</strong> • 📍{" "}
          {item?.location || "Unknown"}
        </p>

        {item?.description && (
          <p className="card-desc">
            {item.description.length > 60
              ? item.description.slice(0, 60) + "..."
              : item.description}
          </p>
        )}

        <div className="card-footer">
          <span className="card-date">
            📅{" "}
            {item?.date
              ? new Date(item.date).toLocaleDateString()
              : "N/A"}
          </span>

          <div className="card-actions">
            {/* ✅ ALWAYS */}
            <Link to={`/item/${item?._id}`}>
              <button className="card-btn secondary">
                View Details
              </button>
            </Link>

            {/* 🔥 CONDITIONAL BUTTON */}
            {isOwner ? (
              <button
                className="card-btn danger"
                onClick={() => navigate(`/delete/${item._id}`)} // or call delete API
              >
                Delete
              </button>
            ) : (
              <button
                className="card-btn primary"
                onClick={() => navigate(`/claim/${item._id}`)}
              >
                Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;