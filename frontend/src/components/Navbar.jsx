import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../index.css";

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        <NavLink to="/" className="logo">
          Campus Lost & Found
        </NavLink>

        <div className="nav-links">

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
              <span className="nav-user" style={{ color: "gray", fontWeight: "bold" }}>
  {user?.email}
</span>

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