const express = require("express");
const FoodCategory = require("../schemas/foodCategorySchema");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await FoodCategory.find();
    res.send(categories);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(404).send({ error: "Category not found" });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = await FoodCategory.create(req.body);
    res.send({
      message: "Food category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await FoodCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(category);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const category = await FoodCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(category);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await FoodCategory.findByIdAndDelete(req.params.id);
    res.send({ message: "Category deleted" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.options("/", (req, res) => {
  res.set("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD");
  res.send();
});

router.head("/", (req, res) => {
  res.status(200).send();
});

module.exports = router;
