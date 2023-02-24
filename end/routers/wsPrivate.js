import { privateChat, strToBase64 } from '../utils/index.js'

/**
 * 私聊模块
 * @param wss ws 实例
 * @param connection wss.connection
 * @param ip 用户Ip
 */
export const wsPrivate = (wss, connection, ip) => {
  console.log('有人私聊');
  // 加入私聊
  privateChat(wss, ip)
  .then(() => {
    connection.send(strToBase64({
      type: 'addWsPrivate',
      data: '尚未完成，别急'
      // data: true
    }))
  })
  .catch(err => console.log(err))
}