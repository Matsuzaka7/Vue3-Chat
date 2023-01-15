import { createApp } from "vue";

import App from "./App.vue";
import { resizeChange } from "./utils/Chat";
import "./assets/font/iconfont.css";
import "./assets/font/iconfont.ttf";
import VueViewer from "v-viewer";

resizeChange();
window.addEventListener("storage", (e) => {
  localStorage.setItem(e.key, e.oldValue);
});

const app = createApp(App);
app.use(VueViewer, {
  defaultOptions: {
    button: false,
    navbar: false,
    title: false,
    toolbar: false
  }
});
app.mount("#app");
