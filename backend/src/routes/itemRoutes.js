const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const { findMatches } = require("../utils/matchItems");

// -------------------- REPORT ITEM --------------------
router.post("/report", async (req, res) => {
  try {
    const item = new Item({
      ...req.body,
      createdBy: req.user?._id, // 🔥 fallback for now
      status: "active",
    });

    await item.save();

    res.json({ message: "Item reported successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// -------------------- MATCHES --------------------
router.get("/matches/:id", async (req, res) => {
  try {
    const currentItem = await Item.findById(req.params.id);

    if (!currentItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const allItems = await Item.find({
      status: "active", // 🔥 ignore claimed items
    });

    const matches = findMatches(currentItem, allItems);

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding matches" });
  }
});

// -------------------- GET ALL ITEMS --------------------
router.get("/", async (req, res) => {
  try {
    const { search = "", page = 1, category, status } = req.query;

    const limit = 6;
    const skip = (page - 1) * limit;

    let query = {
      status: { $ne: "claimed" },
    };

    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.type = status; // 🔥 lost / found
    }

    const items = await Item.find(query)
      .select("-createdBy") // 🔥 hide owner
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET SINGLE ITEM --------------------
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("createdBy", "email"); // 🔥 only if needed later

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- MARK AS CLAIMED --------------------
router.put("/claim/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 SECURITY: only owner can mark claimed
    if (item.createdBy.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    item.status = "claimed";
    await item.save();

    res.json({
      message: "Item marked as claimed",
      item,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;