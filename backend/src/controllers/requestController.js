// controllers/requestController.js
import Notification from "../models/Notification.js";
import { sendNotification } from "../socket.js";

export const requestClaim = async (req, res) => {
  const { itemId, ownerId } = req.body;

  // create notification
  const notification = await Notification.create({
    user_id: ownerId,
    type: "claim",
    message: "Someone requested to claim your reported item",
  });

  // 🔔 real-time push
  sendNotification(req.app.get("io"), ownerId.toString(), notification);

  res.json({ success: true });
};