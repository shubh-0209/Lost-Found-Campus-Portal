import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { socket } from "../socket";
import "../index.css";
import { Bell } from "lucide-react";

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
      // Added Authorization header to prevent 401 errors
      const token = localStorage.getItem("token"); 
      const res = await fetch(`http://localhost:5000/api/notifications`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        console.error("Server returned an error:", res.status);
        return;
      }

      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 📥 Initial fetch logic wrapped in useEffect to prevent infinite loops
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchNotifications();
    }
  }, [isAuthenticated, user?._id]); // Only runs when auth state or user ID changes

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
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
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
              <div className="nav-icons">
  <div className="notification-wrapper" onClick={() => navigate("/notifications")}>
    <Bell size={22} />

    {unreadCount > 0 && (
      <span className="notification-badge">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </div>
</div>

              {/* USER */}
              <div className="nav-right">
                {user && (
                  <Link
                    to="/account"
                    className="user-chip"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="avatar">👤</span>
                    <span className="email">{user.email}</span>
                  </Link>
                )}
              </div>

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