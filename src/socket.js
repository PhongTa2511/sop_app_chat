import { io } from "socket.io-client"

const socket = io("https://sop.idtp.work/", {
  path: "/mes/socket.io",
  withCredentials: true,
  transports: ["websocket", "polling"],
})

// const socket = io("http://localhost:3009/", {
//   withCredentials: true,
//   transports: ["websocket", "polling"], // Thử websocket trước, fallback về polling
// });

export default socket
