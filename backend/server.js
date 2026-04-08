require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const requestRoutes = require("./src/routes/requestRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const authRoutes = require("./src/routes/authRoutes");

// 🔥 socket setup import
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

// routes
app.use("/api/requests", requestRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);

// 🔥 IMPORTANT: create HTTP server
const server = http.createServer(app);

// 🔥 attach socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 🔥 initialize socket logic
setupSocket(io);

// 🔥 make io available in routes/controllers
app.set("io", io);

// start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});