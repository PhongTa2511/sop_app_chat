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

    // 0. Tạo Notification Channel (Bắt buộc cho Android 8.0+)
    if (Capacitor.getPlatform() === 'android') {
      await PushNotifications.createChannel({
        id: 'default',
        name: 'Default Channel',
        description: 'Kênh thông báo mặc định',
        importance: 5, // High importance (hiện pop-up và kêu tiếng)
        visibility: 1,
        sound: 'default',
        vibration: true,
      });
      console.log("Notification channel 'default' created.");
    }

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
      // Hiện token lên màn hình để người dùng copy khi không có cáp USB
      alert("TOKEN CỦA BẠN (Hãy chụp màn hình lại):\n\n" + token.value);
      // TODO: Gửi token này lên server để lưu trữ
      // Example: SetPushToken({ Token: token.value, Device: Capacitor.getPlatform() })
    });

    // Some issue with our setup and push will not work
    await PushNotifications.addListener("registrationError", (error) => {
      console.error("Error on registration: " + JSON.stringify(error));
      alert("LỖI ĐĂNG KÝ THÔNG BÁO:\n" + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push received: " + JSON.stringify(notification));
        
        // THÊM: Alert gỡ lỗi cực mạnh
        alert("ĐÃ NHẬN THÔNG BÁO (Foreground):\n" + (notification.title || "Không có tiêu đề"));

        // Phát âm thanh khi có tin nhắn mới (foreground)
        playNotificationSound();
// ...

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
        alert("Kết quả cấp quyền: " + permission.receive);
      } catch (e) {
        console.error("Request Permissions failed.", e);
        alert("Lỗi khi yêu cầu quyền: " + e.message);
        return;
      }
    }

    if (permission.receive === "granted") {
      console.log("Notification permission granted. Registering...");
      
      // 3. Register with Apple / Google
      setTimeout(async () => {
        try {
          console.log("Calling PushNotifications.register()...");
          alert("Bắt đầu đăng ký FCM...");
          // Chỉ tạo channel nếu chưa có hoặc cần cập nhật, không cần xóa mỗi lần
          if (Capacitor.getPlatform() === 'android') {
             await PushNotifications.createChannel({
                id: 'default',
                name: 'Default Channel',
                importance: 4, // Đổi từ 5 sang 4 để ổn định hơn trên nhiều dòng máy
                visibility: 1,
                sound: 'default',
                vibration: true,
             });
          }
          await PushNotifications.register();
          alert("Gửi lệnh đăng ký thành công! Đang chờ Token...");
        } catch (regError) {
          console.error("Registration error:", regError);
          alert("LỖI KHI GỌI REGISTER(): " + regError.message);
        }
      }, 1000);

    } else {
      console.warn("Push notification permission denied by user or not granted");
    }

  } catch (err) {
    console.error("Fatal error during Push Notifications setup:", err);
  }
};
