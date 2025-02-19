import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
}, { timestamps: true });

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
