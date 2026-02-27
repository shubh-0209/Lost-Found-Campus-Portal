require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
// const itemRoutes = require("./routes/itemRoutes");

// app.use("/api/items", itemRoutes);

app.use("/api/auth", require("./src/routes/authRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
