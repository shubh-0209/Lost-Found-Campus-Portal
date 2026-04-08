import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const ItemCard = ({ item }) => {
const title =
item?.itemName && item.itemName.trim() !== ""
? item.itemName
: "Unnamed Item";

const hasImage = item?.image && item.image.trim() !== "";
    const type = item?.type || item?.status || "";


return ( <div className="card">
{hasImage && ( <div className="card-img"> <img src={item.image} alt={title} /> </div>
)}

```
  <div className="card-body">
    <h3 className="card-title">{title}</h3>

    <p className="card-meta">
      {item?.category || "Unknown"} • 📍 {item?.location || "Unknown"}
    </p>

    {item?.description && (
      <p className="card-desc">
        {item.description.length > 60
          ? item.description.slice(0, 60) + "..."
          : item.description}
      </p>
    )}


<span
  className={`card-badge ${
    type.toLowerCase() === "lost"
      ? "lost"
      : type.toLowerCase() === "found"
      ? "found"
      : "unknown"
  }`}
>
  {type ? type.toUpperCase() : "UNKNOWN"}
</span>

    <div className="card-footer">
      <span className="card-date">
        📅{" "}
        {item?.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "N/A"}
      </span>

      <Link to={`/item/${item?._id}`}>
        <button className="card-btn">View Details</button>
      </Link>
    </div>
  </div>
</div>

);
};

export default ItemCard;
