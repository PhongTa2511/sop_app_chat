/* eslint-disable import/order */
import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import "@/permission";
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
import { createApp } from "vue";
import "./socket";
loadFonts();
// Create vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(router);
app.use(Notifications);
app.component("QuillEditor", QuillEditor);
window.notify = notify;
// Mount vue app
app.mount("#app");
