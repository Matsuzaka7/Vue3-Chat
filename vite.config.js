import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/": resolve(__dirname, "src/*"),
    },
    // 类型： string[] 导入时想要省略的扩展名列表。
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  }
})
