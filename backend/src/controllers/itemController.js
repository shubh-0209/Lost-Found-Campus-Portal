exports.getItems = async (req, res) => {
    try {
      const {
        search = "",
        category,
        status,
        page = 1,
        limit = 6
      } = req.query;
  
      const query = {};
  
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ];
      }
  
      if (category) query.category = category;
      if (status) query.status = status;
  
      const total = await Item.countDocuments(query);
  
      const items = await Item.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      res.json({
        items,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };