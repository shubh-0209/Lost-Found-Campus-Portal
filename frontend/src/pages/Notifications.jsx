import React, { useEffect, useState, useContext } from "react";
import { Bell, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { socket } from "../socket";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../notifications.css";

const Notifications = () => {
const { user } = useContext(AuthContext);
const navigate = useNavigate();

const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);

// ✅ Fetch notifications
const fetchNotifications = async () => {
try {
const res = await fetch(`http://localhost:5000/api/notifications`, {
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});


  const data = await res.json();

  if (Array.isArray(data)) {
    setNotifications(data);
  }
} catch (err) {
  console.error("Error fetching notifications:", err);
} finally {
  setLoading(false);
}


};

useEffect(() => {
if (!user?._id) return;
fetchNotifications();
}, [user]);

// ✅ Join socket room (IMPORTANT)
useEffect(() => {
if (user?._id) {
socket.emit("join", user._id);
}
}, [user]);

// 🔔 Real-time listener
useEffect(() => {
const handleNotification = (data) => {
setNotifications((prev) => {
// prevent duplicates
const exists = prev.find((n) => n._id === data._id);
if (exists) return prev;
return [data, ...prev];
});
};


socket.on("notification", handleNotification);

return () => socket.off("notification", handleNotification);


}, []);

// 🔁 Polling fallback (every 20 sec)
useEffect(() => {
const interval = setInterval(() => {
fetchNotifications();
}, 20000);


return () => clearInterval(interval);


}, []);

// ✅ Mark as read + optional redirect
const markAsRead = async (notification) => {
  // 🟢 Prevent re-click on already read
  if (notification.read) {
    if (notification.itemId) {
      navigate(`/items/${notification.itemId}`);
    }
    return;
  }

  // 🔥 Optimistic UI update (instant)
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
    console.error("Error marking as read:", err);
  }

  // 👉 Navigate AFTER marking
  if (notification.itemId) {
    navigate(`/items/${notification.itemId}`);
  }
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

return ( <div className="notifications-container"> <div className="notifications-header">
   {/* <h2>Notifications</h2> */}
    </div>

  {loading ? (
    <div className="empty-state">
      <p>Loading...</p>
    </div>
  ) : notifications.length === 0 ? (
    <div className="empty-state">
      <Bell size={40} />
      <p>No notifications yet</p>
    </div>
  ) : (
    <div className="notifications-list">
      {notifications.map((n) => (
        <div
          key={n._id}
          className={`notification-card ${
            n.read ? "read" : "unread"
          }`}
          onClick={() => markAsRead(n)}
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
