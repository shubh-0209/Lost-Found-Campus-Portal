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

    const claim = new ClaimRequest({
      reportedItem: item._id,
      claimant: req.user._id,
      claimantEmail: req.user.email,
      reporterEmail: item.createdBy.email,
      answers,
      notes,
      status: "pending",
    });

    await claim.save();

    // 🔔 Notify reporter
    const notification = await Notification.create({
      user: item.createdBy._id,
      type: "claim",
      message: `${req.user.email} requested your item "${item.itemName}"`,
      itemId: item._id,
      claimId: claim._id,
      actionable: true, // 👈 important for Accept/Reject buttons
    });

    const io = req.app.get("io");
    if (io) {
      sendNotification(io, item.createdBy._id.toString(), notification);
    }

    res.json({ success: true, claim });

  } catch (err) {
    console.error("POST CLAIM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📥 GET MY ITEMS
router.get("/my", auth, async (req, res) => {
  try {
    const items = await Item.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error("MY ITEMS ERROR:", error.message);
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
    console.error("GET CLAIMS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ACCEPT / REJECT CLAIM
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, location, contact } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const claim = await ClaimRequest.findById(req.params.id)
  .populate("claimant", "_id email");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    const item = await Item.findById(claim.reportedItem);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 Only owner
    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Update claim
    claim.status = status;
    await claim.save();

    // 🔥 ACCEPTED
    if (status === "accepted") {

      const claim = await ClaimRequest.findById(req.params.id)
        .populate("claimant", "_id email");
    
      console.log("🔥 CLAIM DATA:", claim);
    
      const userId = String(claim.claimant?._id || claim.claimant);
    
      console.log("🔥 FINAL USER ID:", userId);
    
      const notification = await Notification.create({
        user: userId,
        type: "claim_accepted",
        message: "Your claim was accepted. Contact details shared.",
        itemId: claim.reportedItem,
        claimId: claim._id,
        location,
        contact,
      });
    
      const io = req.app.get("io");
    
      if (io && io.sockets.adapter.rooms.has(userId)) {
        io.to(userId).emit("notification", notification);
        console.log("✅ SENT TO CLAIMANT:", userId);
      } else {
        console.log("❌ CLAIMANT NOT IN ROOM:", userId);
      }
    }

    // ❌ REJECTED
    if (status === "rejected") {
      await Item.findByIdAndUpdate(claim.reportedItem, {
        status: "claimed"
      });
      try {
        if (!claim.claimant) {
          console.log("❌ Skipping reject notification: claimant missing");
        } else {
          const userId = claim.claimant.toString();

          const notification = await Notification.create({
            user: userId,
            type: "claim_rejected",
            message: `❌ Your claim for "${item.itemName}" was rejected.`,
            itemId: item._id,
          });

          const io = req.app.get("io");
          if (io) {
            sendNotification(io, userId, notification);
          }
        }
      } catch (err) {
        console.error("❌ Reject notification error:", err);
      }
    }

    // ✅ FINAL RESPONSE (you were missing this)
    return res.json({
      message: `Claim ${status}`,
      claim,
    });

  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;