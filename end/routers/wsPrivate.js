import fs from 'fs'
import { privateChat, strToBase64 } from '../utils/index.js'
import { privatePath, limits } from '../config/index.js'

/**
 * 私聊模块（初次访问时创建文件）
 * @param wss ws 实例
 * @param connection wss.connection
 * @param ip 用户Ip
 * @param targetIP 目标聊天用户Ip
 */
export const wsPrivate = (wss, connection, ip, targetIP) => {
  console.log('有人私聊');
  // 加入私聊
  privateChat(wss, ip)
  .then(() => {
    // 排序，目的是统一文件名称，防止ip传递顺序不一样的情况
    const sort = [ip, targetIP].sort()
    // 创建对应的用户聊天json
    const path = privatePath + `${sort[0]}-${sort[1]}.json`
    try {
      const infoData = JSON.parse(fs.readFileSync(path, "utf8"))
      connection.send(
        strToBase64({
          type: "privateInfoData",
          data: infoData,
        })
      )
    } catch (error) {
      fs.appendFileSync(path, '[]')
    }
  })
  .catch(err => console.log(err))
}

/**
 * 寻找目标用户，发送消息（发给我和目标用户）
 * @param wss ws 实例 
 * @param connection wss.connection
 * @param targetIp 目标ip
 * @param info 消息对象
 */
export const findTargetUser = (wss, connection, targetIp, info) => {
  connection.send(info);
  wss.clients.forEach(function each(client) {
    if (client.ip === targetIp) {
      client.send(info);
    }
  });
}