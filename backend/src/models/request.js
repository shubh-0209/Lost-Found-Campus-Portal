const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },

  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    default: "pending", // pending | accepted | rejected
  },
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);