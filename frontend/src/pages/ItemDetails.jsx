import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  // 🔹 Fetch Item Details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/items/${id}`);
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItem();
  }, [id]);

  // 🔹 Fetch Matches
  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      setShowMatches(true);

      const res = await fetch(
        `http://localhost:5000/api/items/matches/${id}`
      );
      const data = await res.json();

      // ✅ IMPORTANT: Only keep valid matches
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
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lostItemId:
            item.type === "lost" ? item._id : matchItem._id,
  
          foundItemId:
            item.type === "found" ? item._id : matchItem._id,
  
          requesterEmail: "dummy@geetauniversity.edu.in",
  
          ownerEmail: matchItem.createdBy?.email || "owner@mail.com",
  
          // 🔥🔥 MOST IMPORTANT LINE
          ownerId: matchItem.createdBy?._id,
          
        }),
        
      });
      console.log("MATCH ITEM:", matchItem);
      console.log("OWNER ID:", matchItem.createdBy);
      const data = await res.json();
      alert(data.message || "Request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  if (!item) return <p className="loading">Loading...</p>;

  const hasImage = item?.image && item.image.trim() !== "";
  const type = (item?.type || item?.status || "").toLowerCase();

  return (
    <div className="details-container">
      {/* 🔹 ITEM DETAILS */}
      <div className="details-card">
        {hasImage && (
          <div className="details-image">
            <img src={item.image} alt={item?.itemName || "Item"} />
          </div>
        )}

        <div className="details-info">
          <h1 className="details-title">
            {item?.itemName || "No Name"}
          </h1>

          <span className={`details-badge ${type}`}>
            {type ? type.toUpperCase() : "UNKNOWN"}
          </span>

          {item?.status === "claimed" && (
            <span className="claimed-badge">CLAIMED</span>
          )}

          <p className="details-meta">📂 {item?.category || "N/A"}</p>
          <p className="details-meta">📍 {item?.location || "N/A"}</p>

          <p className="details-meta">
            📅{" "}
            {item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "N/A"}
          </p>

          <div className="details-desc">
            <h3>Description</h3>
            <p>{item?.description || "No description"}</p>
          </div>

          {item?.status !== "claimed" && (
            <button className="match-btn" onClick={fetchMatches}>
              🔍 Find Matches
            </button>
          )}
        </div>
      </div>

      {/* 🔹 MATCHES SECTION */}
      {showMatches && (
        <div className="matches-section">
          <h2>🔍 Possible Matches</h2>

          {loadingMatches ? (
            <p>Loading matches...</p>
          ) : matches.length === 0 ? (
            <p className="no-matches">No matches found</p>
          ) : (
            matches.map((match, index) => {
              const isBestMatch = index === 0;

              let confidence = "Low";
              if (match.score >= 15) confidence = "High";
              else if (match.score >= 8) confidence = "Medium";

              const hasMatchImage =
                match?.image && match.image.trim() !== "";

              return (
                <div
                  key={match._id}
                  className={`match-card ${
                    isBestMatch ? "best-match" : ""
                  }`}
                >
                  {hasMatchImage && (
                    <img
                      src={match.image}
                      alt="match"
                      className="match-image"
                    />
                  )}

                  <div className="match-info">
                    <h4>
                      {match?.itemName || "No Name"}
                      {isBestMatch && (
                        <span className="best-badge">
                          {" "}
                          ⭐ Best Match
                        </span>
                      )}
                    </h4>

                    <p>📂 {match?.category || "N/A"}</p>
                    <p>📍 {match?.location || "N/A"}</p>

                    <p>
                      <b>Score:</b> {match.score}
                    </p>

                    <p
                      className={`confidence ${confidence.toLowerCase()}`}
                    >
                      Confidence: {confidence}
                    </p>


                    {item?.status !== "claimed" && (
                      <button
                        className="claim-btn"
                        onClick={() => sendRequest(match)}
                      >
                        📩 Request Claim
                      </button>
                    )}
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