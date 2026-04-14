const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

const sendNotification = (io, userId, notification) => {
  io.to(userId).emit("notification", notification);
};

module.exports = { setupSocket, sendNotification };