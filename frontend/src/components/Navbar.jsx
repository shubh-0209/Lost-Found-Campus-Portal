import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { socket } from "../socket";
import "../index.css";

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔔 Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${user._id}`
      );
  
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 📥 Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // 🔥 Real-time updates
  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  // ✅ Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <NavLink to="/" className="logo">
          Campus Lost & Found
        </NavLink>

        {/* HAMBURGER */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* NAV LINKS */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          <NavLink to="/browse" className="nav-link">
            Browse
          </NavLink>

          <NavLink to="/report" className="nav-link">
            Report Item
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>

              <NavLink to="/register" className="nav-button">
                Register
              </NavLink>
            </>
          ) : (
            <>
              {/* 🔔 NOTIFICATION BELL */}
              <div
                className="notif-icon"
                onClick={() => navigate("/notifications")}
                style={{ cursor: "pointer", position: "relative" }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notif-badge">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* USER */}
              <span className="nav-user" style={{ color: "grey" }}>
                {user?.email}
              </span>

              {/* LOGOUT */}
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;