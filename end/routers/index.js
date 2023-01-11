import express from "express";
import fs from "fs";
import { userDataPath } from "../config/index.js";

const router = express.Router();
router.use(express.urlencoded());
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

// 设置名称
router.post("/setUserName", (req, res) => {
  const ip = req.connection.remoteAddress.split(":")[3];
  const body = req.body;
  if (!body?.name) {
    res.send({
      type: 'err',
      data: '缺少参数'
    })
    return
  }

  const infoData = JSON.parse(fs.readFileSync(userDataPath, "utf8"));
  // 查找已有的数据是否有用户
  const findUser = infoData.find((item) => item.userName === body.name);
  if (findUser) {
    // 如果名称重名将拒绝
    res.send({
      type: "rejectUserName",
      data: false,
    });
    return;
  } else {
    infoData.push({
      userName: body.name,
      ips: [ip],
    });
  }
  fs.writeFileSync(userDataPath, JSON.stringify(infoData, null, 2), "utf8");
  res.send({
    type: 'succeedUserName',
    data: true
  });
});

// 如果ip发生了变化，则需要处理该请求
router.post('/getUserName', (req, res) => {
  const ip = req.connection.remoteAddress.split(":")[3];
  const body = req.body;
  if (!body?.name) {
    res.send({
      type: 'err',
      data: '缺少参数'
    })
    return
  }

  const infoData = JSON.parse(fs.readFileSync(userDataPath, "utf8"));
  // 查找已有的数据是否有用户
  const findUser = infoData.find((item) => item.userName === body.name);
  // 如果有用户先判断本次ip是否存在于数据中
  if (findUser) {
    if (!findUser.ips.includes(ip)) findUser.ips.push(ip)
    res.send({
      type: 'succeedUserName',
      data: true
    });
  } else {
    res.send({
      type: 'notUser',
      data: false
    })
    return
  }
  fs.writeFileSync(userDataPath, JSON.stringify(infoData, null, 2), "utf8");
  

})
export default router;
