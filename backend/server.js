require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const requestRoutes = require("./src/routes/requestRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const authRoutes = require("./src/routes/authRoutes");
const notificationRoutes = require("./src/routes/notificationsRoutes");

// socket setup
const { setupSocket } = require("./socket");

const app = express();

console.log("URI:", process.env.MONGO_URI);

// DB connection
connectDB();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/requests", requestRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

// create HTTP server
const server = http.createServer(app);

// socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// initialize socket
setupSocket(io);

// make io accessible in routes
app.set("io", io);

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});