require("dotenv").config();
const mongoose = require("mongoose");
const FoodOrder = require("../schemas/foodOrderSchema");

mongoose.connect(process.env.MONGO_URI);

async function clear() {
  const result = await FoodOrder.deleteMany({
    user: "64f123abc123abc123abc123",
  });
  console.log("Deleted:", result.deletedCount);
  process.exit();
}

clear();
