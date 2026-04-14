const express = require("express");
const router = express.Router();

const ClaimRequest = require("../models/ClaimRequest");
const Notification = require("../models/notifications");
const Item = require("../models/item");

const { sendNotification } = require("../../socket");
const auth = require("../middleware/auth");

// 📩 CREATE CLAIM REQUEST
router.post("/", auth, async (req, res) => {
  try {
    const { reportedItemId, answers, notes } = req.body;

    const item = await Item.findById(reportedItemId).populate("createdBy");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ CREATE CLAIM
    const claim = new ClaimRequest({
      reportedItem: item._id,
      claimantEmail: req.user.email,
      reporterEmail: item.createdBy.email,
      answers,
      notes,
    });

    await claim.save();

    // ✅ CREATE NOTIFICATION (FIXED STRUCTURE)
    const notification = await Notification.create({
      user: item.createdBy._id, // 🔥 FIXED (was user_id)
      type: "claim",
      message: `${req.user.email} requested your item "${item.itemName}"`,
      itemId: item._id, // 🔥 IMPORTANT for redirect
      // read: false,
      
    });

    // ✅ EMIT REAL-TIME NOTIFICATION
    const io = req.app.get("io");

    if (io) {
      sendNotification(io, item.createdBy._id.toString(), notification);
    } else {
      console.warn("Socket.io not initialized");
    }

    res.json({ success: true, claim });

  } catch (err) {
    console.error("POST CLAIM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📥 GET MY CLAIMS (your items)
router.get("/my", auth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await Item.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    console.error("🔥 MY ITEMS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// 📥 GET claims for specific item
router.get("/item/:itemId", auth, async (req, res) => {
  try {
    const claims = await ClaimRequest.find({
      reportedItem: req.params.itemId,
    }).sort({ createdAt: -1 });

    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;