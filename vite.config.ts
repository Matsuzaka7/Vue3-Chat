import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import VitePrettier from 'vite-plugin-prettier';
const chatUrl = 'http://chat-Matsuzaka:1000';
// https://vitejs.dev/config/
export default defineConfig({
  // 代理配置
  server: {
    proxy: {
      '/api': {
        // 配置需要代理的路径 --> 这里的意思是代理http://localhost:80/api/后的所有路由
        target: chatUrl, // 目标地址 --> 服务器地址
        changeOrigin: true, // 允许跨域
        ws: true, // 允许websocket代理
        // 重写路径 --> 作用与vue配置pathRewrite作用相同
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    VitePrettier({
      printWidth: 80, //单行长度
      tabWidth: 2, //缩进长度
      useTabs: false, //使用空格代替tab缩进
      semi: true, //句末使用分号
      singleQuote: true, //使用单引号
      quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
      jsxSingleQuote: true, // jsx中使用单引号
      trailingComma: 'all', //多行时尽可能打印尾随逗号
      bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
      jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
      arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
      requirePragma: false, //无需顶部注释即可格式化
      insertPragma: false, //在已被preitter格式化的文件顶部加上标注
      proseWrap: 'preserve', //不知道怎么翻译
      htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
      vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
      endOfLine: 'lf', //结束行形式
      embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
    }),
  ],

  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
});
