import { Request, Response } from "express";
import { redisClient } from "../utils/redisConfig";
import TaskModel from "../models/taskModel";

const MAX_CACHE_ITEMS = 50;
const REDIS_KEY = `FULLSTACK_TASK_NEO`;

export const addTask = async (task: string) => {
  const tasks = JSON.parse((await redisClient.get(REDIS_KEY)) || "[]");
  tasks.push(task);

  if (tasks.length > MAX_CACHE_ITEMS) {
    await TaskModel.insertMany(tasks.map((text: string) => ({ text })));
    await redisClient.del(REDIS_KEY);
  } else {
    await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
  }
};

export const fetchAllTasks = async (req: Request, res: Response) => {
  const tasks = await TaskModel.find();
  res.json(tasks);
};
