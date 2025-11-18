const { Schema, model } = require("mongoose");

const FoodCategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = model("FoodCategory", FoodCategorySchema);
