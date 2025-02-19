import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

socket.on("connect", () => console.log("✅ WebSocket Connected to Server"));
socket.on("connect_error", (err) => console.log("❌ WebSocket Error:", err));

export default socket;
