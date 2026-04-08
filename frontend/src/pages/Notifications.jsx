import React, { useEffect, useState, useContext } from "react";
import { Bell, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { socket } from "../socket";
import { AuthContext } from "../context/authContext";
import "../notifications.css";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  // 📥 Fetch from backend
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5000/api/notifications/${user._id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, [user]);

  // 🔔 Real-time listener
  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  // ✅ Mark as read
  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: "PUT",
    });

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "match":
        return <CheckCircle size={20} />;
      case "message":
        return <MessageCircle size={20} />;
      case "claim":
        return <AlertCircle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        {/* <h2>Notifications</h2> */}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={40} />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-card ${n.read ? "read" : "unread"}`}
              onClick={() => markAsRead(n._id)}
            >
              <div className="icon">{getIcon(n.type)}</div>

              <div className="content">
                <p className="message">{n.message}</p>
                <span className="time">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {!n.read && <div className="dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;