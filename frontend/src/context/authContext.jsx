import React, { createContext, useState, useEffect } from "react";
import { connectSocket, disconnectSocket } from "../socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // ✅ Connect socket once
        connectSocket(parsedUser._id);
      } catch (err) {
        console.error("Invalid stored user:", err);
        localStorage.clear();
      }
    } else {
      localStorage.clear();
    }

    setLoading(false);

    // 🔥 Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  // 🔐 Login
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);

    // ✅ Connect socket
    connectSocket(userData._id);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);

    // ✅ Disconnect socket
    disconnectSocket();
  };

  const token = localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};