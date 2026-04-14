const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/notifications");

// ✅ GET user notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
    });

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;