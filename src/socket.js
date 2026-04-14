import { io } from "socket.io-client";

// const url = import.meta.env.VITE_MESSAGE_SOCKET_URL || "http://localhost:3009/";
// const path = import.meta.env.VITE_MESSAGE_SOCKET_PATH || "/socket.io";
const url = "https://sop.idtp.work/";
const path = "/mes/socket.io";

const socket = io(url, {
  path,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
