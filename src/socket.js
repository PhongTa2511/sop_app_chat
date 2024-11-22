import { io } from "socket.io-client";

const socket = io("http://messageapi.icpc1hn.work/", {
  withCredentials: true,
  transports: ["websocket", "polling"], // Thử websocket trước, fallback về polling
});

export default socket;
