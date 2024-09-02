import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import AxiosPlugin from "./plugins/appAxios";
import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";

createApp(App)
  .use(router)
  .use(createPinia())
  .use(AxiosPlugin)
  .use(Vue3Toastify, {
    autoClose: 2000,
  })
  .mount("#app");
