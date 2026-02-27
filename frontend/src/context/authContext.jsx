import { createContext, useState, useEffect } from "react";
import React from "react";

export const AuthContext = createContext();

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (user && loginTime) {
      const currentTime = Date.now();

      if (currentTime - loginTime < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        logout(); 
      }
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTime", Date.now());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};