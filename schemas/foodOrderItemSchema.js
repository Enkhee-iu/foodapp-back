

const { Schema } = require("mongoose");

const foodOrderItemSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "Food",          
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

module.exports = foodOrderItemSchema;