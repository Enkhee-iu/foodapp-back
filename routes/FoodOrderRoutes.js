const express = require("express");
const router = express.Router();
const FoodOrder = require("../schemas/foodOrderSchema");

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
router.get("/", async (req, res) => {
  const { userId } = req.query;

  let filter = {};
  if (userId) filter.user = userId;

  const orders = await FoodOrder.find(filter)
    .populate("foodOrderItems.food", "name price image")
    .sort({ createdAt: -1 }); // ⭐ шинэ нь дээр

  res.json({ success: true, data: orders });
});

/* =========================
   GET ORDER BY ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id)
      .populate("user", "firstName email")
      .populate("foodOrderItems.food", "name price image");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Захиалга олдсонгүй" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   CREATE ORDER (CHECKOUT)
========================= */
router.post("/", async (req, res) => {
  try {
    const { user, foodOrderItems, totalPrice } = req.body;

    if (!user || !foodOrderItems?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Order data дутуу байна" });
    }

    const order = await FoodOrder.create({
      user,
      foodOrderItems,
      totalPrice,
    });

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

/* =========================
   UPDATE DELIVERY STATUS
========================= */
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

    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "firstName email")
      .populate("foodOrderItems.food", "name price image");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Захиалга олдсонгүй" });
    }

    res.json({
      success: true,
      message: "Статус амжилттай шинэчлэгдлээ",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   DELETE ORDER
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const order = await FoodOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Захиалга олдсонгүй" });
    }

    res.json({ success: true, message: "Захиалга устгагдлаа" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const auth = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  const orders = await FoodOrder.find({ user: req.user.id });
  res.json({ success: true, data: orders });
});

module.exports = router;
