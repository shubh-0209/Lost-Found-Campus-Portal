import React from "react";
import { useLocation } from "react-router-dom";

const ClaimSuccess = () => {
  const { state } = useLocation();

  if (!state) {
    return <p>No data found</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎉 Claim Accepted</h2>

      <p><strong>Item:</strong> {state.itemName}</p>

      <p><strong>📍 Location:</strong> {state.location}</p>
      <p><strong>📞 Contact:</strong> {state.contact}</p>
    </div>
  );
};

export default ClaimSuccess;