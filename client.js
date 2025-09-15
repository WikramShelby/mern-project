import { io } from "socket.io-client";

// Connect to backend Socket.io server
const socket = io("http://localhost:5000");

socket.on("connect", () => console.log("✅ Connected! Socket ID:", socket.id));

socket.on("taskCreated", task => console.log("🟢 Task Created:", task));
socket.on("taskUpdated", task => console.log("🔵 Task Updated:", task));
socket.on("taskDeleted", taskId => console.log("🔴 Task Deleted:", taskId));
socket.on("projectCreated", project => console.log("🟡 Project Created:", project));
socket.on("aiTaskSuggestion", suggestion => console.log("💡 AI Suggestion:", suggestion));

socket.on("disconnect", () => console.log("❌ Disconnected"));
