const express = require("express");
const router = express.Router();
const multer = require("multer");

const Item = require("../models/item");

// 🔥 MULTER CONFIG
const upload = multer({ dest: "uploads/" });
const auth = require("../middleware/auth");

// -------------------- REPORT ITEM --------------------
// ✅ Only FOUND items allowed (enforced in backend)
router.post("/report", auth, upload.single("image"), async (req, res) => {
  try {
    // parse attributes safely
    let attributes = {};
    try {
      attributes = JSON.parse(req.body.attributes || "{}");
    } catch (err) {
      return res.status(400).json({ message: "Invalid attributes format" });
    }

    const { itemName, description, category, location, date } = req.body;

    if (!itemName || !description || !category || !location || !date) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const item = new Item({
      itemName,
      description,
      category,
      location,
      date,
      attributes,
      type: "found",
      image: req.file ? req.file.path : "",
      createdBy: req.user._id, // 🔥 SECURE: Get ID from the verified token, not req.body
      status: "active",
    });

    await item.save();

    res.json({
      message: "Item reported successfully",
      item,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// -------------------- GET ALL FOUND ITEMS (BROWSE) --------------------
router.get("/", async (req, res) => {
  try {
    const { page = 1, category } = req.query;

    const limit = 6;
    const skip = (page - 1) * limit;

    let query = {
      type: "found",
      status: { $ne: "claimed" },
    };

    if (category) {
      query.category = category;
    }

    const items = await Item.find(query)
    .populate("createdBy", "_id name") // 🔥 ADD THIS
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


// -------------------- SEARCH FOUND ITEMS --------------------
router.get("/search", async (req, res) => {
  try {
    const { q = "", category } = req.query;

    let query = {
      type: "found",
      status: { $ne: "claimed" },
      $or: [
        { itemName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    };

    if (category) {
      query.category = category;
    }

    const items = await Item.find(query)
  .populate("createdBy", "_id name") 
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search error" });
  }
});
router.get("/my", auth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await Item.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json(items);

  } catch (error) {
    console.error("🔥 MY ITEMS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET SINGLE ITEM --------------------
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("createdBy", "email");

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

    // 🔐 Only reporter can mark claimed
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