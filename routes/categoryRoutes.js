const express = require("express");
const FoodCategory = require("../schemas/foodCategorySchema");
const Food = require("../schemas/foodSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await FoodCategory.find().populate("dishes");
    res.send(categories);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.id).populate(
      "dishes"
    );
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
    const categoryId = req.params.id;

    // 1️⃣ Энэ категорид харьяалагдсан бүх хоолыг устгана
    await Food.deleteMany({ category: categoryId });

    // 2️⃣ Дараа нь категори устгана
    await FoodCategory.findByIdAndDelete(categoryId);

    res.send({
      message: "Category and related foods deleted successfully",
      categoryId,
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);
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
