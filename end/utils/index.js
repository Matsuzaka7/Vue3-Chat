
import ws from 'ws'
/**
 * 广播
 * @param wss ws实例
 * @param data 数据对象
 */
export const broadList = (wss, data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
};


/**
 * 加入私聊
 * @param wss ws实例
 * @param ip 作为寻找用户的标识
 */
export const privateChat = (wss, ip) => {
  return new Promise((res, rej) => {
    for (const clients of wss.clients) {
      if (clients.ip === ip) {
        res()
        break;
      }
    }
    rej()
  })
}

/**
 * 将数据转为base64
 * @param data 数据对象
 */
export const strToBase64 = (data) => {
  const buffer = Buffer.from(JSON.stringify(data));
  return buffer.toString("base64");
};