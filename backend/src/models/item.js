const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },

  itemName: {
    type: String,
    required: true
  },

  category: String,

  description: {
    type: String,
    required: true
  },

  color: String,
  brand: String,

  location: {
    type: String,
    required: true
  },

  building: String,

  date: Date,
  time: String,

  image: String,

  phone: String,
  reward: String,
  notes: String,

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);