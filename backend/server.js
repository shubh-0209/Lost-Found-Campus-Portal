require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path"); // 🔥 Added for static files
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const requestRoutes = require("./src/routes/requestRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const authRoutes = require("./src/routes/authRoutes");
const notificationRoutes = require("./src/routes/notificationsRoutes"); // 🔥 Added this

// socket setup import
const { setupSocket } = require("./socket");

const app = express();

// DB connection
connectDB();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// 🔥 SERVE STATIC IMAGES
// This allows the browser to access http://localhost:5000/uploads/image.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/requests", requestRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes); // 🔥 Added: Fixes the 404 error in Navbar

// IMPORTANT: create HTTP server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// initialize socket logic
setupSocket(io);

// make io available in routes/controllers
app.set("io", io);

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});