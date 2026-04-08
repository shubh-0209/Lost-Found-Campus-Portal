const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    // 🔥 CORE INFO
    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    // 🔥 IMPORTANT (for matching logic)
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    // 🔥 STATUS
    status: {
      type: String,
      enum: ["active", "claimed"],
      default: "active",
    },

    // 🔥 OWNER (VERY IMPORTANT)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 INDEXES (for better performance later)
itemSchema.index({ itemName: "text", description: "text" });
itemSchema.index({ category: 1 });
itemSchema.index({ type: 1 });
itemSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Item", itemSchema);