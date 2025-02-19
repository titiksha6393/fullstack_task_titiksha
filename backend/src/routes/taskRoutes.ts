import express from "express";
import { fetchAllTasks } from "../controllers/taskController";
const router = express.Router();

router.get("/fetchAllTasks", fetchAllTasks);

export default router;
