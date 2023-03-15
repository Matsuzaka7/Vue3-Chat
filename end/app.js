
import express from "express"
import history from "connect-history-api-fallback"
import { wsHost, httpHost } from "./config/index.js"
import userRouter from './routers/index.js'
import { createFs } from "./utils/createFs.js"

const app = express()
app.use(userRouter)
app.use(express.static("data/imgs"))
app.use(express.static("data/files"))
app.use(history({
  rewrites: []
}))

// 检测一次该路径是否有该文件
createFs()
import('./ws/groupWS.js')

app.listen(httpHost, () => {
  console.log(
    `
      本地服务已启动
        - ws端口为：${wsHost}
        - http端口为：${httpHost}
    `
  )
})
