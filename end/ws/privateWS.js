import { wsHost, infoDataPath, userDataPath, privatePath, limits } from "../config/index.js"
import { wsPrivate, findTargetUser } from '../routers/wsPrivate.js'
import { wss } from "./groupWS.js"
export const HandlePrivateFn = (data) => {
  // 处理客户端发送过来的私聊消息
  if (data.type === "addInfoData") {
    const sort = [ip, targetIP].sort()
    const path = privatePath + `${sort[0]}-${sort[1]}.json`
    const infoData = JSON.parse(fs.readFileSync(path, "utf8"));
    const infoObj = {
      type: 'text',
      id: String(Date.now() + Math.random() ).substring(2, 16),
      time: Date.now(),
      userIP: ip,
      value: data.data.value,
      username: data.data.username
    };
    infoData.push(infoObj);
    fs.writeFileSync(path, JSON.stringify(infoData, null, 2), "utf8");
    // 将消息只发给我和目标人物
    findTargetUser(wss, connection, targetIP, strToBase64({
      type: "privateNewInfo",
      data: { ...infoObj, value: data.data.value }
    }))
  }
}