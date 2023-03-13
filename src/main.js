import { createApp } from "vue";
import { createPinia } from 'pinia'
import VueViewer from "v-viewer";

import "./assets/font/iconfont.css";
import { resizeChange } from "./utils/chat";
import router from './router'
import App from "./App.vue";

const app = createApp(App);
const store = createPinia()
app.use(store)
app.use(router)
app.use(VueViewer, {
  defaultOptions: {
    button: false,
    navbar: false,
    title: false,
    toolbar: false
  }
});
app.mount("#app");

resizeChange();
window.addEventListener("storage", (e) => {
  localStorage.setItem(e.key, e.oldValue);
});
