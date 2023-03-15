import fs from "fs"
import { WebSocketServer } from "ws"
import express from "express"
import history from "connect-history-api-fallback"
import userRouter from './routers/index.js'
import { wsHost, httpHost, infoDataPath, userDataPath, privatePath, limits } from "./config/index.js"
import { broadList, strToBase64 } from './utils/index.js'
import { wsPrivate, findTargetUser } from './routers/wsPrivate.js'

const app = express()
app.use(userRouter)
app.use(express.static("data/imgs"))
app.use(express.static("data/files"))
app.use(history({
  rewrites: [
    
  ]
}))

// 创建 http ws，端口为1000
export let wss = new WebSocketServer({ port: wsHost });

// 所有人的名单
let personList = [];
// 检测一次该路径是否有该文件
try {
  fs.readFileSync(infoDataPath, "utf8")
} catch (error) {
  fs.appendFileSync(infoDataPath, '[]')
}

try {
  fs.readFileSync(userDataPath, "utf8")
} catch (error) {
  fs.appendFileSync(userDataPath, '[]')
}

let interval;
function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (connection, req) => {
  const ip = req.connection.remoteAddress.split(":")[3];
  const targetIP = req.url.slice(1)
  // targetIP 有值代表私聊
  if (targetIP.trim()) {
    // 有人加入私聊（需要初始化两人聊天的记录）
    wsPrivate(wss, connection, ip, targetIP)
    connection.on("message", function (connectionData, reason) {
      const data = JSON.parse(connectionData.toString());
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
    });
    return void 0;
  }

  connection.isAlive = true;
  connection.ip = ip
  connection.on("pong", heartbeat);
  // 用户每次访问时都返回一次ip给用户
  connection.send(
    strToBase64({
      type: "userIP",
      data: ip,
    })
  );

  // 用户进入时根据ip查找一次用户名返回给用户
  const userData = JSON.parse(fs.readFileSync(userDataPath, "utf8"))
  const findUserName = userData.find(item => item.ips.includes(ip))
  if (findUserName) {
    connection.send(
      strToBase64({
        type: "findUserName",
        data: findUserName.userName,
      })
    );
  } else {
    connection.send(
      strToBase64({
        type: "notUser",
        data: false,
      })
    );
  }

  // 检测链接是否有效
  interval = setInterval(() => {
    wss.clients.forEach(function ping(client) {
      if (client.isAlive === false) return client.terminate();
      client.ping();
    });
  }, 10000);

  connection.send(
    strToBase64({
      type: "notice",
      data: "友好交流，有bug反馈哦",
    })
  );

  // 加载条数
  const infoData = JSON.parse(fs.readFileSync(infoDataPath, "utf8"))
  connection.send(
    strToBase64({
      type: "infoData",
      data: infoData.slice(-limits),
    })
  );

  // 向所有人员的名单中添加ip
  if (!personList.includes(ip)) {
    personList.push(ip);
  }
  // 有人进来时 把所有的ip进行广播
  broadList(
    wss,
    strToBase64({
      type: "personList",
      data: {
        personList,
      },
    })
  );

  // 处理客户端关闭
  connection.on("close", function (code, reason) {
    personList = personList.filter((f) => f !== ip);
    broadList(
      wss,
      strToBase64({
        type: "personList",
        data: {
          personList,
        },
      })
    );
    clearInterval(interval);
  });

  // 处理客户端发送过来的消息
  connection.on("message", function (connectionData, reason) {
    const data = JSON.parse(connectionData.toString());
    if (data.type === "addInfoData") {
      const infoData = JSON.parse(fs.readFileSync(infoDataPath, "utf8"));
      const infoObj = {
        type: 'text',
        id: String(Date.now() + Math.random() ).substring(2, 16),
        time: Date.now(),
        userIP: ip,
        value: data.data.value,
        username: data.data.username
      };
      infoData.push(infoObj);
      fs.writeFileSync(infoDataPath, JSON.stringify(infoData, null, 2), "utf8");
      broadList(
        wss,
        strToBase64({
          type: "newInfo",
          data: { ...infoObj, value: data.data.value }
        })
      );
    }
  });

  //监听异常
  connection.on("error", (err) => {
    console.log(err);
    console.log('connection.on("error")');
  });

  // 监听data事件
  connection.on("data", (data) => {
    console.log(data);
    console.log('connection.on("data")');
  });
});

app.listen(httpHost, () => {
  console.log(
    `
      本地服务已启动
        - ws端口为：${wsHost}
        - http端口为：${httpHost}
    `
  )
})
