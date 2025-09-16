import express from "express";
import authMiddleware from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

/**
 * POST /api/ai/suggest-task
 * Suggests a next task for a project
 */
router.post("/suggest-task", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.body;

    // Fetch existing tasks for context
    const tasks = await Task.find({ project: projectId });

    // Simple AI logic: suggest next task based on count
    const suggestion = `Next task could be: Review ${tasks.length} existing tasks`;

    // Emit to all connected clients
    const io = req.app.get("io");
    io.emit("aiTaskSuggestion", { projectId, suggestion });

    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/ai/summarize-tasks
 * Summarizes all tasks in a project
 */
router.post("/summarize-tasks", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.body;

    const tasks = await Task.find({ project: projectId });

    if (!tasks.length) return res.json({ summary: "No tasks found for this project." });

    const summary = tasks.map(t => `• ${t.title} [${t.status}]`).join("\n");

    // Emit summary in real-time
    const io = req.app.get("io");
    io.emit("aiTaskSummary", { projectId, summary });

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
