const mongoose = require("mongoose");

const claimRequestSchema = new mongoose.Schema(
  {
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    // ✅ ADD THIS (missing piece)
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimantEmail: {
      type: String,
      required: true,
    },

    reporterEmail: {
      type: String,
      required: true,
    },

    answers: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    notes: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ClaimRequest", claimRequestSchema);