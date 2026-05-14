import { io } from "socket.io-client";

// const url = import.meta.env.VITE_MESSAGE_SOCKET_URL || "http://localhost:3009/";
// const path = import.meta.env.VITE_MESSAGE_SOCKET_PATH || "/socket.io";
const url = "https://sop.idtp.work/";
const path = "/mes/socket.io";

const socket = io(url, {
  path,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
});

export default socket;
