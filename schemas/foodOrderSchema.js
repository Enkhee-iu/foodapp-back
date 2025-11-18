const { Schema, model } = require("mongoose");
const foodOrderItemSchema = require("./foodOrderItemSchema");
const FoodOrderStatusEnum = require("../utils/orderStatus");   

const FoodOrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodOrderItems: [foodOrderItemSchema],  
  totalPrice: { type: Number, required: true, min: 0 },
  
  status: {
    type: String,
    enum: Object.values(FoodOrderStatusEnum),     
    default: FoodOrderStatusEnum.PENDING          
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FoodOrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = model("FoodOrder", FoodOrderSchema);