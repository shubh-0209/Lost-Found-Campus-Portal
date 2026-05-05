import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Account from "./pages/Account";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseItems from "./pages/BrowseItems";
import ReportItem from "./pages/ReportItem";
import ItemDetails from "./pages/ItemDetails";
import Notifications from "./pages/Notifications"; 
import ClaimItem from "./pages/ClaimItem";
import ClaimsPage from "./pages/ClaimsPage";
import ClaimSuccess from "./pages/ClaimSuccess";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔌 SOCKET
import { socket } from "./socket";

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  // 🔥 Register user to socket
 
  // 🔔 Listen for real-time notifications
  useEffect(() => {
    socket.on("notification", (data) => {
      console.log("🔔 New Notification:", data);

      // Toast alert
      toast.info(data.message || "New Notification", {
        position: "top-right",
      });
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  

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

<Route
  path="/account"
  element={
    <PrivateRoute>
      <Account />
    </PrivateRoute>
  }
/>

        {/* 🔔 Notifications Page */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

<Route
  path="/claim/:id"
  element={
    <PrivateRoute>
      <ClaimItem />
    </PrivateRoute>
  }
/>

<Route path="/claims/:itemId" element={<ClaimsPage />} />

        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/claim-success/:id" element={<ClaimSuccess />} />

      </Routes>

    
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;