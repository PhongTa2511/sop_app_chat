import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { playNotificationSound } from "@/utils/notification";

export const setupPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Push notifications not supported on web platform");
    return;
  }

  try {
    console.log("Initializing Push Notifications setup...");

    // 1. Add listeners BEFORE registering
    try {
      // removeAllListeners can sometimes fail if plugin is not fully ready
      await PushNotifications.removeAllListeners();
    } catch (e) {
      console.warn("Could not remove listeners:", e);
    }

    // On success, we should be able to receive notifications
    await PushNotifications.addListener("registration", (token) => {
      console.log(`Push registration success, token: ${token.value}`);
      // TODO: Gửi token này lên server để lưu trữ
      // Example: SetPushToken({ Token: token.value, Device: Capacitor.getPlatform() })
    });

    // Some issue with our setup and push will not work
    await PushNotifications.addListener("registrationError", (error) => {
      console.error("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push received: " + JSON.stringify(notification));

        // Phát âm thanh khi có tin nhắn mới (foreground)
        playNotificationSound();

        // Hiển thị notification alert nếu app đang mở (Vue Notification)
        if (window.notify) {
          window.notify({
            title: notification.title || "Thông báo",
            text: notification.body || "Bạn có tin nhắn mới",
            type: "success",
          });
        }
      },
    );

    // Method called when tapping on a notification
    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push action performed: " + JSON.stringify(notification));
        // Xử lý khi người dùng nhấn vào thông báo (ví dụ: mở phòng chat)
      },
    );

    // 2. Request permission
    console.log("Checking push notification permissions...");
    let permission = { receive: 'prompt' };
    try {
      permission = await PushNotifications.checkPermissions();
    } catch (e) {
      console.error("Check Permissions failed. Native plugin might not be configured.", e);
      return;
    }
    
    if (permission.receive !== "granted") {
      console.log("Requesting permissions...");
      try {
        permission = await PushNotifications.requestPermissions();
      } catch (e) {
        console.error("Request Permissions failed.", e);
        return;
      }
    }

    if (permission.receive === "granted") {
      console.log("Notification permission granted. Registering...");
      
      // 3. Register with Apple / Google
      // CỰC KỲ QUAN TRỌNG: Nếu thiếu file google-services.json, lệnh register() này sẽ làm sập app.
      // Tôi để trong một khối try-catch native nhất có thể.
      setTimeout(async () => {
        try {
          console.log("Calling PushNotifications.register()...");
          await PushNotifications.register();
          console.log("PushNotifications.register() call completed.");
        } catch (regError) {
          console.error("CRITICAL: Native Push Registration failed. This usually means google-services.json is missing or invalid.", regError);
        }
      }, 1000);

    } else {
      console.warn("Push notification permission denied by user or not granted");
    }

  } catch (err) {
    console.error("Fatal error during Push Notifications setup:", err);
  }
};
