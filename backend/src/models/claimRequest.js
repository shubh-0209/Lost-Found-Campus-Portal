const mongoose = require("mongoose");

const claimRequestSchema = new mongoose.Schema(
  {
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
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
      required: true, // dynamic fields filled by claimant
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    notes: { type: String },
    image: { type: String }, // optional proof image
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClaimRequest", claimRequestSchema);