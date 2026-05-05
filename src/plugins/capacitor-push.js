import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

export const setupPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Push notifications not supported on web platform");
    return;
  }

  try {
    console.log("Initializing Push Notifications setup...");

    // 1. Add listeners BEFORE registering
    // This ensures we catch the events even if registration is very fast
    await PushNotifications.removeAllListeners();

    // On success, we should be able to receive notifications
    await PushNotifications.addListener("registration", (token) => {
      console.log(`Push registration success, token: ${token.value}`);
      // TODO: Send this token to your server to save it
      // Example: axios.post('/api/save-token', { token: token.value })
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

        // Hiển thị notification alert nếu app đang mở
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
        // TODO: Navigate user to specific chat page
      },
    );

    // 2. Request permission
    console.log("Requesting notification permissions...");
    let permission = await PushNotifications.checkPermissions();
    
    if (permission.receive !== "granted") {
      permission = await PushNotifications.requestPermissions();
    }

    if (permission.receive === "granted") {
      console.log("Notification permission granted. Registering...");
      
      // Add a small delay to ensure OS state is synchronized
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Register with Apple / Google
      // We wrap this in a separate try-catch because it's most likely to fail natively
      try {
        await PushNotifications.register();
      } catch (regError) {
        console.error("Native Push Registration failed. Check if google-services.json/GoogleService-Info.plist is missing.", regError);
      }
    } else {
      console.warn("Push notification permission denied by user");
    }

  } catch (err) {
    console.error("Fatal error during Push Notifications setup:", err);
  }
};
