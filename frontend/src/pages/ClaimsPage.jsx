import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../Claim.css";

const ClaimsPage = () => {
  const { itemId } = useParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 📥 Fetch claims
  const fetchClaims = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [itemId]);

  // ✅ Accept / Reject
  const handleAction = async (claimId, status) => {
    if (processingId === claimId) return; // 🚫 prevent double call
  
    setProcessingId(claimId);
  
    try {
      let location = "";
      let contact = "";
  
      if (status === "accepted") {
        location = prompt("Enter meeting location:");
        if (!location) return;
  
        contact = prompt("Enter contact number:");
        if (!contact) return;
      }
  
      const res = await fetch(
        `http://localhost:5000/api/requests/${claimId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status, location, contact }),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Error updating claim");
      }
  
      toast.success(`Claim ${status}`);
      fetchClaims();
  
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p>Loading claims...</p>;

  if (!claims.length) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No claims yet</h2>
        <p>This item has no claim requests.</p>
      </div>
    );
  }

  return (
    <div className="claims-container">
      {claims.map((claim) => (
        <div key={claim._id} className="claim-card">

          <div className="claim-header">
            <div>
              <p className="label">Claimant</p>
              <p className="value">{claim.claimantEmail}</p>
            </div>

            <span className={`status ${claim.status}`}>
              {claim.status}
            </span>
          </div>

          <div className="answers-section">
            <p className="label">Answers</p>

            <div className="answers-grid">
              {Object.entries(claim.answers || {}).map(([key, value]) => (
                <div key={key} className="answer-item">
                  <span className="answer-key">{key}</span>
                  <span className="answer-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="actions">
          <button
  className="btn accept"
  disabled={claim.status !== "pending" || processingId === claim._id}
  onClick={() => handleAction(claim._id, "accepted")}
>
  {processingId === claim._id ? "Processing..." : "Accept"}
</button>

            <button
              className="btn reject"
              disabled={claim.status !== "pending"}
              onClick={() => handleAction(claim._id, "rejected")}
            >
              Reject
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ClaimsPage;