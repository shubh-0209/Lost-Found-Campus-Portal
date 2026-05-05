const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("❌ ERROR NAME:", error.name);
    console.error("❌ ERROR MESSAGE:", error.message);
    console.error("❌ FULL ERROR:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
