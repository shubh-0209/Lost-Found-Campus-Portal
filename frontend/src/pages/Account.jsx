import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import "../Account.css";

const Account = () => {
  const { user } = useContext(AuthContext);
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:5000";

  // Helper to format image URLs correctly
  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BACKEND_URL}/${path.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    if (user){
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      const token = localStorage.getItem("token"); // ✅ FIX

      // const token = localStorage.getItem("token");

if (!token) {
  console.error("No token found");
  setLoading(false); 
  return;
}
  
      // 🔹 Fetch reported items
      const itemsRes = await fetch(`${BACKEND_URL}/api/items/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const itemsData = await itemsRes.json();
  
      // 🔹 Fetch my claim requests
      const claimsRes = await fetch(`${BACKEND_URL}/api/requests/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const claimsData = await claimsRes.json();
  
      const itemsArray = Array.isArray(itemsData) ? itemsData : itemsData.items || [];
      const claimsArray = Array.isArray(claimsData) ? claimsData : claimsData.claims || [];
  
      setMyItems(itemsArray);
      setMyClaims(claimsArray);
  
    } catch (err) {
      console.error("Error fetching account data:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="loader-container"><p>Loading your dashboard...</p></div>;

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>Welcome, {user?.name || "User"}</h1>
        <p className="user-email">📧 {user?.email}</p>
      </div>

      <div className="account-grid">
        {/* SECTION: MY REPORTED ITEMS */}
        <div className="account-section">
          <h3>📦 My Reported Items</h3>
          <div className="account-list">
            {myItems.length === 0 ? (
              <p className="empty-text">You haven't reported any items yet.</p>
            ) : (
              myItems.map((item) => (
                <div key={item._id} className="account-card">
                  <div className="account-card-img">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.itemName} 
                      className={item.type === "found" ? "blur-img" : ""} 
                    />
                  </div>
                  <div className="account-card-info">
                    <h4>{item.itemName}</h4>
                    <span className={`status-badge ${item.status}`}>{item.status}</span>
                    <p>📍 {item.location}</p>
                    <Link to={`/item/${item?._id}`} className="view-link">View Details →</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION: MY CLAIM REQUESTS */}
        <div className="account-section">
          <h3>📩 My Claim Requests</h3>
          <div className="account-list">
            {myClaims.length === 0 ? (
              <p className="empty-text">No active claim requests.</p>
            ) : (
              myClaims.map((claim) => (
                <div key={claim._id} className="account-card claim-card">
                  <div className="account-card-info">
                    <h4>Request for: {claim.reportedItem?.itemName || "Item"}</h4>
                    <p><strong>Status:</strong> <span className={`status-text ${claim.status}`}>{claim.status}</span></p>
                    <p className="date-text">Requested on: {new Date(claim.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;