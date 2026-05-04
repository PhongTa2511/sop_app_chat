import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

export const setupPushNotifications = async () => {
  if (Capacitor.isNativePlatform()) {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will return 'granted' without prompting
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === "granted") {
      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register();
    } else {
      // Show some error
      console.warn("Push notification permission denied");
    }

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token) => {
      console.log(`Push registration success, token: ${token.value}`);

      // TODO: Gửi token này lên server của bạn để lưu lại
      // Example: axios.post('/api/save-token', { token: token.value })
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push received: " + JSON.stringify(notification));

        // Hiển thị notification alert nếu app đang mở
        if (window.notify) {
          window.notify({
            title: notification.title,
            text: notification.body,
            type: "success",
          });
        }
      },
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push action performed: " + JSON.stringify(notification));

        // TODO: Điều hướng người dùng tới trang chat cụ thể
        // window.location.href = '/mobile-chat'
      },
    );
  }
};
