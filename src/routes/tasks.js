import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/auth.js";


const router = express.Router();


// Create task
router.post("/", authMiddleware, async (req, res) => {
try {
const task = await Task.create({ ...req.body });
const io = req.app.get("io");
io.emit("taskCreated", task);
res.status(201).json(task);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Get tasks for a project
router.get("/:projectId", authMiddleware, async (req, res) => {
try {
const tasks = await Task.find({ project: req.params.projectId });
res.json(tasks);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Update task
router.put("/:id", authMiddleware, async (req, res) => {
try {
const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
const io = req.app.get("io");
io.emit("taskUpdated", task);
res.json(task);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
try {
await Task.findByIdAndDelete(req.params.id);
const io = req.app.get("io");
io.emit("taskDeleted", req.params.id);
res.json({ message: "Task deleted" });
} catch (err) {
res.status(500).json({ message: err.message });
}
});


export default router;