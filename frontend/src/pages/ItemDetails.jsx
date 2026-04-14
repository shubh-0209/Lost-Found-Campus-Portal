import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();
  const BACKEND_URL = "http://localhost:5000";

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  // Get current user from localStorage for the claim request
  const user = JSON.parse(localStorage.getItem("user"));

  // Helper to format image URLs
  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BACKEND_URL}/${path.replace(/\\/g, "/")}`;
  };

  // 🔹 Fetch Item Details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/items/${id}`);
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };
    fetchItem();
  }, [id]);

  // 🔹 Fetch Matches
  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      setShowMatches(true);
      const res = await fetch(`${BACKEND_URL}/api/items/matches/${id}`);
      const data = await res.json();

      const filteredMatches = Array.isArray(data)
        ? data.filter((m) => m.score && m.score > 0)
        : [];
      setMatches(filteredMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  // 🔹 Send Claim Request
  const sendRequest = async (matchItem) => {
    if (!user) {
      alert("Please login to send a claim request.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          lostItemId: item.type === "lost" ? item._id : matchItem._id,
          foundItemId: item.type === "found" ? item._id : matchItem._id,
          requesterEmail: user.email, // Use actual logged-in user email
          ownerEmail: matchItem.createdBy?.email || "owner@mail.com",
          ownerId: matchItem.createdBy?._id || matchItem.createdBy,
        }),
      });

      const data = await res.json();
      alert(data.message || "Request sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  if (!item) return <p className="loading">Loading item details...</p>;

  const hasImage = item?.image && item.image.trim() !== "";
  const type = (item?.type || item?.status || "").toLowerCase();

  return (
    <div className="details-container">
      {/* 🔹 MAIN ITEM DETAILS */}
      <div className="details-card">
        {hasImage && (
          <div className="details-image-wrapper">
            <img 
              src={getImageUrl(item.image)} 
              alt={item?.itemName} 
              className="details-img-blurred" // 🔥 Applied Blur
            />
            <div className="blur-overlay">Found Item Image Protected</div>
          </div>
        )}

        <div className="details-info">
          <h1 className="details-title">{item?.itemName || "No Name"}</h1>
          <span className={`details-badge ${type}`}>
            {type ? type.toUpperCase() : "UNKNOWN"}
          </span>

          <p className="details-meta">📂 {item?.category || "N/A"}</p>
          <p className="details-meta">📍 {item?.location || "N/A"}</p>
          <p className="details-meta">📅 {new Date(item.createdAt).toLocaleDateString()}</p>

          <div className="details-desc">
            <h3>Description</h3>
            <p>{item?.description || "No description provided."}</p>
          </div>

          {item?.status !== "claimed" && (
            <button className="match-btn" onClick={fetchMatches}>
              🔍 Find Matching Items
            </button>
          )}
        </div>
      </div>

      {/* 🔹 MATCHES SECTION */}
      {showMatches && (
        <div className="matches-section">
          <h2>🔍 Possible Matches</h2>
          {loadingMatches ? (
            <p>Scanning database for matches...</p>
          ) : matches.length === 0 ? (
            <p className="no-matches">No potential matches found at this time.</p>
          ) : (
            matches.map((match, index) => {
              const isBestMatch = index === 0;
              let confidence = match.score >= 15 ? "High" : match.score >= 8 ? "Medium" : "Low";

              return (
                <div key={match._id} className={`match-card ${isBestMatch ? "best-match" : ""}`}>
                  {match.image && (
                    <div className="match-image-wrapper">
                      <img
                        src={getImageUrl(match.image)}
                        alt="match"
                        className="match-image-blurred" // 🔥 Applied Blur to matches too
                      />
                    </div>
                  )}

                  <div className="match-info">
                    <h4>
                      {match?.itemName}
                      {isBestMatch && <span className="best-badge"> ⭐ Best Match</span>}
                    </h4>
                    <p>📂 {match?.category}</p>
                    <p>📍 {match?.location}</p>
                    <p className={`confidence ${confidence.toLowerCase()}`}>
                      Confidence: <strong>{confidence}</strong> ({match.score} pts)
                    </p>

                    <button className="claim-btn" onClick={() => sendRequest(match)}>
                      📩 Request Claim
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDetails;