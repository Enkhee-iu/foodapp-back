const express = require("express");
const router = express.Router();
const FoodOrder = require("../schemas/foodOrderSchema");

// const requireAdmin = require("../middleware/requireAdmin");
// const requireRestaurant = require("../middleware/requireRestaurant");
// const requireDriver = require("../middleware/requireDriver");
// const requireUser = require("../middleware/requireUser");

router.get("/", async (req, res) => {
  try {
    const orders = await FoodOrder.find()
      .populate("user", "firstName email phoneNumber")

      .populate("foodOrderItems.food", "name price image")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id)
      .populate("user", "firstName email")
      .populate("foodOrderItems.food", "name price image");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Захиалга олдсонгүй" });

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Танд энэ захиалгыг харах эрх байхгүй",
      });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    req.body.user = req.user._id;

    const order = await FoodOrder.create(req.body);
    const populated = await FoodOrder.findById(order._id)
      .populate("user", "firstName email")
      .populate("foodOrderItems.food", "name price image");

    res.status(201).json({
      success: true,
      message: "Захиалга амжилттай үүслээ!",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "on_the_way",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Буруу статус" });
    }

    const allowedRoles = ["admin", "restaurant", "driver"];
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Танд статус өөрчлөх эрх байхгүй" });
    }

    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    )
      .populate("user", "firstName email")
      .populate("foodOrderItems.food", "name price image");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Захиалга олдсонгүй" });

    res.json({
      success: true,
      message: "Статус амжилттай шинэчлэгдлээ",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await FoodOrder.findByIdAndDelete(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Захиалга олдсонгүй" });

    res.json({ success: true, message: "Захиалга амжилттай устгагдлаа" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
