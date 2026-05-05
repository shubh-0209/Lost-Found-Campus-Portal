const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔐 Join personal room (for notifications)
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User joined personal room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// 🔔 Send notification helper
const sendNotification = (io, userId, notification) => {
  io.to(userId.toString()).emit("notification", notification);
};

module.exports = { setupSocket, sendNotification };