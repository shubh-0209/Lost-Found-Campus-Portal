import { io } from "socket.io-client";

const URL = "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// 🔌 Connect socket
export const connectSocket = (userId) => {
  if (!userId) return;

  if (!socket.connected) {
    socket.connect();
  }

  const handleConnect = () => {
    console.log("✅ Socket connected:", socket.id);

    // join personal room
    socket.emit("join", userId);
  };

  socket.off("connect", handleConnect); // prevent duplicate listeners
  socket.on("connect", handleConnect);

  socket.on("reconnect", () => {
    console.log("🔄 Reconnected");
    socket.emit("join", userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });
};

// ❌ Disconnect (on logout)
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// 🔔 Notification listener (ONLY this remains)
export const onNotification = (callback) => {
  socket.on("notification", callback);
};

export const removeNotificationListener = () => {
  socket.off("notification");
};