import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseItems from "./pages/BrowseItems";
import ReportItem from "./pages/ReportItem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";


function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <PrivateRoute>
              <BrowseItems />
            </PrivateRoute>
          }
        />

        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportItem />
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;