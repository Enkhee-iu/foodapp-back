const { Schema, model } = require("mongoose");

const foodSchema = new Schema(
  {
    foodName: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    ingredients: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "FoodCategory" },
  },
  { timestamps: true }
);

module.exports = model("Food", foodSchema);
