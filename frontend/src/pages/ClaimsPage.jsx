import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClaimsPage = () => {
const { itemId } = useParams();

const [claims, setClaims] = useState([]);
const [loading, setLoading] = useState(true);

const fetchClaims = async () => {
    try {
      console.log("Fetching claims for:", itemId);
  
      const res = await fetch(
        `http://localhost:5000/api/requests/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("Response status:", res.status);
  
      const data = await res.json();
      console.log("Claims data:", data);
  
      setClaims(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
fetchClaims();
}, [itemId]);

if (loading) return <p>Loading claims...</p>;

if (!claims || claims.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No claims yet</h2>
        <p>This item has no claim requests.</p>
      </div>
    );
  }

return (
<div style={{ padding: "20px" }}> <h2>Claim Requests</h2>


  {claims.map((claim) => (
    <div
      key={claim._id}
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
      }}
    >
      <p><strong>Claimant:</strong> {claim.claimantEmail}</p>

      <p><strong>Status:</strong> {claim.status}</p>

      <div>
        <strong>Answers:</strong>
        <pre>{JSON.stringify(claim.answers, null, 2)}</pre>
      </div>

      <button style={{ marginRight: "10px" }}>
        Accept
      </button>

      <button>
        Reject
      </button>
    </div>
  ))}
</div>


);
};

export default ClaimsPage;
