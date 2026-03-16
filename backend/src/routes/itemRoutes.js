const express = require("express");
const router = express.Router();
const Item = require("../models/item");


router.post("/report", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();

    res.json({
      message: "Item reported successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {

    const { search = "", page = 1, category, status } = req.query;

    const limit = 6;
    const skip = (page - 1) * limit;

    let query = {};

    // SEARCH
    if (search) {
      query.itemName = { $regex: search, $options: "i" };
    }

    // CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    // STATUS FILTER
    if (status) {
      query.type = status;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;