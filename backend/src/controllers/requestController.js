import Notification from "../models/notifications.js";
import Request from "../models/request.js";
import { sendNotification } from "../socket.js";

export const requestClaim = async (req, res) => {
  try {
    const { itemId, ownerId } = req.body;

    // ✅ create request (THIS WAS MISSING)
    const request = await Request.create({
      user: req.user.id,
      foundItemId: itemId,
      ownerId,
    });

    // ✅ create notification
    const notification = await Notification.create({
      user_id: ownerId,
      type: "claim",
      message: "Someone requested to claim your reported item",
    });

    // 🔔 real-time push
    sendNotification(req.app.get("io"), ownerId.toString(), notification);

    res.json({ success: true, request });
  } catch (error) {
    console.error("REQUEST CLAIM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); // debug

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const requests = await Request.find({
      user: req.user.id || req.user._id,
    })
      .populate("foundItemId")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error("GET MY REQUESTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};