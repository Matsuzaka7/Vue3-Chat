const fs = require("fs");
const ws = require("ws");

// 创建 http wws，端口为1000
let wss = new ws.WebSocketServer({ port: 1001 });

// 所有人的名单
let personList = [];
// 聊天数据路径
const infoDataPath = "../data/infoData.json";
// 检测一次该路径是否有该文件
try {
  fs.readFileSync(infoDataPath, "utf8")
} catch (error) {
  fs.appendFileSync(infoDataPath, '[]')
}

// 广播, 需要接收一个实例, 和数据
const broadList = (wss, data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
};

const strToBase64 = (data) => {
  const buffer = Buffer.from(JSON.stringify(data));
  return buffer.toString("base64");
};

let interval;
function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (connection, req) => {
  const ip = req.connection.remoteAddress.split(":")[3];
  connection.isAlive = true;
  connection.on("pong", heartbeat);
  // 用户每次访问时都返回一次ip给用户
  connection.send(
    strToBase64({
      type: "userIP",
      data: ip,
    })
  );

  // 检测链接是否有效
  interval = setInterval(() => {
    wss.clients.forEach(function ping(client) {
      if (client.isAlive === false) return client.terminate();
      client.ping();
    });
  }, 10000);

  // 代表重复的ip进入了网站，让客户端直接断掉请求
  // if (personList.includes(ip)) {
  //   const reject = {
  //     type: 'rejectWs',
  //     data: '同一ip请勿同时打开多个网页'
  //   }
  //   connection.send(JSON.stringify(reject))
  //   return
  // }

  connection.send(
    strToBase64({
      type: "notice",
      data: "友好交流，有bug反馈哦",
    })
  );

  // 初次加载条数
  const limits = 15
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
        id: String(Date.now() + Math.random() ).substring(2, 16),
        time: Date.now(),
        userIP: ip,
        value: data.data,
      };
      infoData.push(infoObj);
      fs.writeFileSync(infoDataPath, JSON.stringify(infoData, null, 2), "utf8");
      broadList(
        wss,
        strToBase64({
          type: "newInfo",
          data: infoObj,
        })
      );
    } else if (data.type === "loadMoreInfo") {
      const { page, limit } = data.data
      const infoData = JSON.parse(fs.readFileSync(infoDataPath, "utf8"));
      const sliceData = infoData.slice(-(limits + page * limit), -(limit + (page-1) *limit))
      connection.send(
        strToBase64({
          type: "loadMoreData",
          data: {
            isMore: sliceData.length === 0 ? false : true,
            data: sliceData
          },
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
