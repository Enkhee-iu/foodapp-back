const express = require("express");
const Food = require("../schemas/foodSchema");
const FoodCategory = require("../schemas/foodCategorySchema");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("category");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("category");
    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newFood = await Food.create(req.body);

    await FoodCategory.findByIdAndUpdate(req.body.category, {
      $push: { dishes: newFood._id },
    });

    res.status(201).json({ message: "Food added", data: newFood });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
