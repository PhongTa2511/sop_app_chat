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

if (typeof Capacitor !== "undefined" && Capacitor.isNativePlatform()) {
  try {
    Keyboard.setScroll({ isDisabled: true }); // Ngăn WebView scroll bậy bạ
    Keyboard.setResizeMode({ mode: KeyboardResize.Body }); // Đẩy layout lên thay vì đè lên

    // Khởi tạo Push Notifications
    setupPushNotifications();
  } catch (e) {
    console.log(e);
  }
}
