import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    user: { // person who is claiming
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foundItemId: { // item being claimed
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    ownerId: { // item owner
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);