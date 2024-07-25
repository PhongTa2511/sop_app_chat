import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44369/signalr-hub") // Đảm bảo URL đúng với cấu hình server-side của bạn
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }

  async start() {
    try {
      await this.connection.start();
      console.log("SignalR connected");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setTimeout(() => this.start(), 5000);
    }
  }

  on(eventName, callback) {
    this.connection.on(eventName, callback);
  }

  off(eventName, callback) {
    this.connection.off(eventName, callback);
  }
}

export default new SignalRService();
