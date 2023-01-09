import { createApp } from "vue";
import App from "./App.vue";
import { resizeChange } from './utils/Chat'
import './assets/font/iconfont.css'
import './assets/font/iconfont.ttf'

resizeChange()
window.addEventListener("storage", (e) => {
  localStorage.setItem(e.key, e.oldValue);
})

const app = createApp(App);

app.mount("#app");
