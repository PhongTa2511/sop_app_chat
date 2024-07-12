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
import { createPinia } from "pinia";
import { createApp } from "vue";
loadFonts();

// Create vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(Notifications);
window.notify = notify;
// Mount vue app
app.mount("#app");
