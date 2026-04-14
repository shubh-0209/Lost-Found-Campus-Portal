exports.getItems = async (req, res) => {
  try {
    let {
      search = "",
      category,
      status,
      page = 1,
      limit = 6,
    } = req.query;

    // 🔥 sanitize numbers
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 6;

    const query = {};

    // 🔥 FIXED: itemName instead of title
    if (search.trim()) {
      query.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }, // optional boost
      ];
    }

    if (category) query.category = category;
    if (status) query.status = status;

    const total = await Item.countDocuments(query);

    const items = await Item.find(query)
      .populate("createdBy", "_id name") // 🔥 owner info
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // 🔥 better performance

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total, // 🔥 useful for frontend
    });
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createItem = async (req, res) => {
  try {
    // 🔥 DEBUG (optional)
    console.log("USER FROM TOKEN:", req.user);

    const newItem = new Item({
      itemName: req.body.itemName,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      image: req.body.image,
      type: req.body.type,
      status: req.body.status || "active",

      // 🔥 MOST IMPORTANT LINE
      createdBy: req.user._id,
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      createdBy: req.user._id,
    })
      .populate("createdBy", "_id name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ items });
  } catch (error) {
    console.error("GET MY ITEMS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};