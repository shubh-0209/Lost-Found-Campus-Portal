import React, { useEffect, useState, useContext, useCallback } from "react";
import { Bell, CheckCircle, AlertCircle } from "lucide-react";
import { socket } from "../socket";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../notifications.css";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch Notifications
  // -----------------------------
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?._id) fetchNotifications();
  }, [user, fetchNotifications]);

  // -----------------------------
  // Socket Setup
  // -----------------------------
  useEffect(() => {
    if (!user?._id) return;
  
    const joinRoom = () => {
      socket.emit("join", String(user._id));
      console.log("JOINED ROOM:", user._id);
    };
  
    // join when socket connects
    socket.on("connect", joinRoom);
  
    // if already connected
    if (socket.connected) {
      joinRoom();
    }
  
    const handleNotification = (data) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === data._id);
        return exists ? prev : [data, ...prev];
      });
    };
  
    socket.on("notification", handleNotification);
  
    return () => {
      socket.off("connect", joinRoom);
      socket.off("notification", handleNotification);
    };
  }, [user]);

  // fallback polling
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // -----------------------------
  // Helpers
  // -----------------------------
  const isNavigable = (n) => {
    const id =
      typeof n.itemId === "object"
        ? n.itemId?._id
        : n.itemId || n.claimId;
  
    return n.type === "claim" && Boolean(id);
  };

  const getItemId = (n) =>
    typeof n.itemId === "object" ? n.itemId._id : n.itemId;

  const getIcon = (type) => {
    switch (type) {
      case "claim_accepted":
        return <CheckCircle size={20} />;
      case "claim":
        return <AlertCircle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  // -----------------------------
  // Mark as read
  // -----------------------------
  const markAsRead = async (notification) => {
    if (notification.read) return;

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id ? { ...n, read: true } : n
      )
    );

    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notification._id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation(); // 🔥 prevent card click
  
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // 🔥 remove from UI instantly
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notificationId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // -----------------------------
  // Claim actions
  // -----------------------------
  const handleAccept = async (e, n) => {
    e.stopPropagation();

    const location = prompt("Enter meeting location:");
    if (!location) return;

    const contact = prompt("Enter contact number:");
    if (!contact) return;

    try {
      await fetch(`http://localhost:5000/api/requests/${n.claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: "accepted",
          location,
          contact,
        }),
      });

      fetchNotifications();
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleReject = async (e, n) => {
    e.stopPropagation();

    try {
      await fetch(`http://localhost:5000/api/requests/${n.claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      fetchNotifications();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (loading) {
    return (
      <div className="notifications-container">
        <div className="empty-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={40} />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => {
            const navigable = isNavigable(n);

            return (
              <div
                key={n._id}
                className={`notification-card ${
                  n.read ? "read" : "unread"
                } ${navigable ? "clickable" : "non-clickable"}`}
                onClick={
                  isNavigable(n)
                    ? () => {
                        markAsRead(n);
                
                        const id =
                          typeof n.itemId === "object"
                            ? n.itemId?._id
                            : n.itemId || n.claimId;
                
                        if (id) navigate(`/claims/${id}`);
                      }
                    : undefined
                }
              >
                <div className="icon">{getIcon(n.type)}</div>

                <div className="content">
                  <p className="message">{n.message}</p>

                  {n.location && (
                    <p>
                      📍 <strong>Location:</strong> {n.location}
                    </p>
                  )}

                  {n.contact && (
                    <p>
                      📞 <strong>Contact:</strong> {n.contact}
                    </p>
                  )}

                  {n.actionable && (
                    <div className="actions">
                      <button onClick={(e) => handleAccept(e, n)}>
                        Accept
                      </button>
                      <button onClick={(e) => handleReject(e, n)}>
                        Reject
                      </button>
                    </div>
                  )}

                  <span className="time">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {!n.read && <div className="dot" />}
                <button
  className="delete-btn"
  onClick={(e) => handleDelete(e, n._id)}
>
  🗑 Delete
</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;