const express = require("express");
const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("API working");
});

app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
