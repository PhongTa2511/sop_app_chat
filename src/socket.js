import { io } from "socket.io-client";

// const socket = io("https://messageapi.icpc1hn.work/", {
//   withCredentials: true,
//   transports: ["websocket", "polling"], // Thử websocket trước, fallback về polling
// });

const socket = io("http://localhost:3000/", {
  withCredentials: true,
  transports: ["websocket", "polling"], // Thử websocket trước, fallback về polling
});

export default socket;
