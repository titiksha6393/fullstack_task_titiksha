import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import TaskModel from "./models/taskModel";
import { redisClient } from "./utils/redisConfig";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const REDIS_KEY = "FULLSTACK_TASK_NEO";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Create HTTP server for WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client Connected!");

  // Add Task and move to MongoDB if needed
  socket.on("add", async (taskText: string) => {
    if (!taskText || taskText.trim() === "") {
      console.log("Ignoring empty task.");
      return;
    }
    console.log("Received Task:", taskText);

    let tasks = JSON.parse((await redisClient.get(REDIS_KEY)) || "[]");

    // Store task as an object with unique id
    const newTask = { id: uuidv4(), text: taskText };
    tasks.push(newTask);

    await redisClient.set(REDIS_KEY, JSON.stringify(tasks));

    io.emit("taskAdded", newTask);
    console.log("Task Added:", newTask);

    if (tasks.length > 50) {
      console.log("50+ tasks detected. Moving tasks to MongoDB...");

      try {
        await TaskModel.insertMany(tasks);
        await redisClient.del(REDIS_KEY);
        console.log("Tasks moved to MongoDB and Redis cache cleared.");
      } catch (err) {
        console.error("MongoDB Insert Failed:", err);
      }
    }
  });

  // Delete Task by id
  socket.on("delete", async (taskId: string) => {
    if (!taskId) {
      console.log("Ignoring delete request for invalid task.");
      return;
    }
    try {
      let tasks = JSON.parse((await redisClient.get(REDIS_KEY)) || "[]");
      tasks = tasks.filter((task: any) => task.id !== taskId);
      await redisClient.set(REDIS_KEY, JSON.stringify(tasks));

      const deletedTask = await TaskModel.findOneAndDelete({ id: taskId });

      io.emit("taskDeleted", taskId);
      console.log("Task Deleted:", taskId, "| Deleted from MongoDB:", !!deletedTask);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  });

  socket.on("disconnect", () => console.log("Client Disconnected"));
});

// Fetch all tasks from Redis and MongoDB
app.get("/fetchAllTasks", async (req, res) => {
  try {
    let redisTasks = JSON.parse((await redisClient.get(REDIS_KEY)) || "[]");

    const rawMongoTasks = await TaskModel.find().sort({ createdAt: -1 }).lean();
    const formattedMongoTasks = rawMongoTasks
      .filter((task: any) => task._id && task.text)
      .map((task: any) => ({
        id: String(task._id),
        text: task.text,
      }));

    redisTasks = redisTasks.filter((task: any) => task && task.id && task.text);
    const combinedTasks = [...redisTasks.reverse(), ...formattedMongoTasks];

    res.json(combinedTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Clear Redis cache
app.get("/flush-redis", async (req, res) => {
  try {
    await redisClient.del(REDIS_KEY);
    console.log("Redis cache cleared!");
    res.json({ message: "Redis cache cleared!" });
  } catch (err) {
    console.error("Error flushing Redis:", err);
    res.status(500).json({ error: "Redis flush failed" });
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
