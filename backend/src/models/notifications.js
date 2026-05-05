const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "match",
        "claim",
        "message",
        "system",
        "claim_accepted",
        "claim_rejected"
      ],
      default: "system",
    },
    message: String,
    read: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    location: {
      type: String,
    },
    
    contact: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);