const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/todos", async (req, res, next) => {
  try {
    const items = await Todo.find({}).sort({ createdAt: -1 }).limit(200).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/todos", async (req, res, next) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }
    const item = await Todo.create({ text: text.trim() });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { done, text } = req.body || {};
    const update = {};
    if (typeof done === "boolean") update.done = done;
    if (typeof text === "string" && text.trim()) update.text = text.trim();

    const item = await Todo.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Todo.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: "not found" });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;

