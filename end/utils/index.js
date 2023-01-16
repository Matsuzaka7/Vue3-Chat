
import ws from 'ws'
// 广播, 需要接收一个实例, 和数据
export const broadList = (wss, data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
};

// 将数据转为base
export const strToBase64 = (data) => {
  const buffer = Buffer.from(JSON.stringify(data));
  return buffer.toString("base64");
};