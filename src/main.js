import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import DateField from "@/components/DateField.vue";
import { Capacitor } from "@capacitor/core";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";

import "@/permission";
import { setupPushNotifications } from "@/plugins/capacitor-push";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import "@core/scss/template/index.scss";
import Notifications, { notify } from "@kyvg/vue3-notification";
import "@layouts/styles/index.scss";
import "@styles/styles.scss";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { createApp } from "vue";
import "./socket";

loadFonts();

// Create vue app
const app = createApp(App);

app.component("VDatePicker2", DatePicker);
app.component("VDateField", DateField);

// Use plugins
app.use(vuetify);
app.use(router);
app.use(Notifications);
app.component("QuillEditor", QuillEditor);
window.notify = notify;

// Mount vue app
app.mount("#app");

// Khôi phục theme đã lưu (dark / light) từ localStorage
try {
  const savedTheme = localStorage.getItem('dtp_theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    vuetify.theme.global.name.value = savedTheme;
  }
} catch (_) {}

if (typeof Capacitor !== "undefined" && Capacitor.isNativePlatform()) {
  try {
    Keyboard.setScroll({ isDisabled: true });
    Keyboard.setResizeMode({ mode: KeyboardResize.Body });

    // Khởi tạo Push Notifications sau khi app đã mount ổn định
    // Thêm delay để tránh crash ngay khi mở app nếu plugin gặp lỗi
    setTimeout(() => {
      setupPushNotifications().catch(e => console.error("Push Setup Error:", e));
    }, 2000);
  } catch (e) {
    console.log("Capacitor Init Error:", e);
  }
}
