import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../utils/socket";
import { PlusCircle, Trash2 } from "lucide-react"; // "+" icon
import noteIcon from "../images/icons8-notes-app 1.png";

// Define Task type with id and text
interface Task {
  id: string;
  text: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/fetchAllTasks")
      .then((res) => {
        setTasks(res.data);
        console.log("Initial Task List:", res.data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));

    socket.on("taskAdded", (task: Task) => {
      setTasks((prev) => [task, ...prev]); // Add new tasks to the top
      console.log("Task Added (Live):", task);
    });

    socket.on("taskDeleted", (taskId: string) => {
      console.log("Task Deleted (Live):", taskId);
      setTasks((prev) => prev.filter(task => task.id !== taskId));
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskDeleted");
    };
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      socket.emit("add", newTask);
      setNewTask("");
    }
  };

  const deleteTask = (taskId: string) => {
    socket.emit("delete", taskId);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Container:
          - On small devices: h-auto with max-h-[90vh] and vertical margin (my-8)
          - On md and up: fixed height of 742px with no extra vertical margin */}
      <div className="w-full max-w-[759px] h-auto max-h-[90vh] bg-white rounded-[12px] border border-gray-300 p-6 shadow-lg flex flex-col my-8 md:my-0 md:h-[742px]">

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={noteIcon}
            alt="Notes Icon"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-[86px] md:h-[86px]"
          />
          <h2 className="font-inter font-bold text-[32px] sm:text-[40px] md:text-[48px] leading-[1.2] tracking-[0%] text-gray-900">
            Note App
          </h2>
        </div>

        {/* Search & Add Button */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <input
            type="text"
            className="font-inter font-normal text-[20px] sm:text-[24px] md:text-[30px] w-full md:w-[500px] h-[50px] md:h-[72px] text-[#303C4DA3] border border-gray-300 rounded-[12px] p-6"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="New Note..."
          />
          <button
            className="font-inter font-bold text-[22px] sm:text-[26px] md:text-[28px] w-full md:w-[154px] h-[50px] md:h-[72px] bg-[#92400E] text-white rounded-[12px] flex items-center justify-center gap-2 hover:bg-[#b15f2c]"
            onClick={addTask}
          >
            <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" />
            Add
          </button>
        </div>

        <h3 className="font-inter font-bold sm:text-[26px] md:text-[30px] leading-[36.31px] tracking-[0%] text-gray-900 mb-2">
          Notes
        </h3>
        <hr className="border-t-2 divide-gray-300 w-full mb-2" />

        {/* Notes List Section */}
        <div className="w-full rounded-md flex-grow overflow-y-auto max-h-[300px] md:max-h-[500px] custom-scrollbar">
          <ul className="divide-y divide-gray-300">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="p-3 flex justify-between items-center text-gray-900 break-words">
                  <span className="sm:text-[26px] md:text-[30px] break-all pr-5">{task.text}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center py-2">No notes available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
