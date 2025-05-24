import express from "express";
import Subject from "../models/model.js";

const router = express.Router();

router.get("/subjects", async (req, res) => {
  try {
    const data = await Subject.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/subjects", async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
});

router.put("/subjects/:id", async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Subject not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

router.delete("/subjects/:id", async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
