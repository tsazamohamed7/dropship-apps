import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "./style.css";
import 'font-awesome/css/font-awesome.min.css'
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    console.log("New version available");
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
