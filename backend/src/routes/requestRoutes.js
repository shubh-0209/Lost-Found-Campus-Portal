const express = require("express");
const router = express.Router();
const ClaimRequest = require("../models/ClaimRequest");
const Notification = require("../models/notifications.js");
const { sendNotification } = require("../../socket");

// 📩 CREATE REQUEST + NOTIFICATION
router.post("/", async (req, res) => {
  try {
    const {
      lostItemId,
      foundItemId,
      requesterEmail,
      ownerEmail,
      ownerId,
    } = req.body;

    const request = new ClaimRequest({
      lostItem: lostItemId,
      foundItem: foundItemId,
      requesterEmail,
      ownerEmail,
    });

    await request.save();

    // 🔔 Create notification
    const notification = await Notification.create({
      user_id: ownerId,
      type: "claim",
      message: "Someone requested to claim your item",
    });

    // 🔥 Real-time emit
    const io = req.app.get("io");
    sendNotification(io, ownerId.toString(), notification);

    res.json({ message: "Request sent + notification created" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;