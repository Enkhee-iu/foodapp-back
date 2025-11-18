const express = require("express");
const Food = require("../schemas/foodSchema");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.send(foods);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).send({ error: "Food not found" });
    res.send(food);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newFood = await Food.create(req.body);
    res.send({ message: "Food added", data: newFood });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.send({ message: "Food deleted" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
