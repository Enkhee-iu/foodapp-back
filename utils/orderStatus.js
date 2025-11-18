

const FoodOrderStatusEnum = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  ON_THE_WAY: "on_the_way",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

Object.freeze(FoodOrderStatusEnum);
module.exports = FoodOrderStatusEnum;