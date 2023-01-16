import express from "express";
import fs from "fs";
import formidable from "formidable";
import process from "process";
import { userDataPath, infoDataPath, httpDomain } from "../config/index.js";
import { wss } from "../app.js";
import { broadList, strToBase64 } from "../utils/index.js";

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
      type: "err",
      data: "缺少参数",
    });
    return;
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
    type: "succeedUserName",
    data: true,
  });
});

// 如果ip发生了变化，则需要处理该请求
router.post("/getUserName", (req, res) => {
  const ip = req.connection.remoteAddress.split(":")[3];
  const body = req.body;
  if (!body?.name) {
    res.send({
      type: "err",
      data: "缺少参数",
    });
    return;
  }

  const infoData = JSON.parse(fs.readFileSync(userDataPath, "utf8"));
  // 查找已有的数据是否有用户
  const findUser = infoData.find((item) => item.userName === body.name);
  // 如果有用户先判断本次ip是否存在于数据中
  if (findUser) {
    if (!findUser.ips.includes(ip)) findUser.ips.push(ip);
    res.send({
      type: "succeedUserName",
      data: true,
    });
  } else {
    res.send({
      type: "notUser",
      data: false,
    });
    return;
  }
  fs.writeFileSync(userDataPath, JSON.stringify(infoData, null, 2), "utf8");
});

// 处理上传图片
const imgPath = process.cwd() + '/data/imgs/'
router.post("/uploadImg", (req, res) => {
  const ip = req.connection.remoteAddress.split(":")[3];
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    const { userName, imageBase64 } = fields
    if (err) {
      res.send({
        type: 'err',
        data: '意外错误E1，请稍后重试'
      })
      return
    }
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(base64Data, 'base64');
    const newDate = new Date()
    const fileName = `${newDate.getFullYear()}-${newDate.getDay()+1}-${newDate.getDate()}-${newDate.getHours()}-${newDate.getMinutes()}-${String(Math.random()).substring(2,7)}.jpg`
    if (base64Data.length) {
      fs.writeFile(imgPath+fileName, dataBuffer, function (err) {
        if (err) {
          res.send({
            type: 'saveImage',
            data: false
          });
        } else {
          const infoData = JSON.parse(fs.readFileSync(infoDataPath, "utf8"));
          const infoObj = {
            type: 'image',
            id: String(Date.now() + Math.random() ).substring(2, 16),
            time: Date.now(),
            userIP: ip,
            value: fileName,
            username: userName
          };
          infoData.push(infoObj);
          fs.writeFileSync(infoDataPath, JSON.stringify(infoData, null, 2), "utf8");
          broadList(wss, strToBase64({
            type: 'newInfo',
            data: {...infoObj, httpDomain}
          }))
          res.send({
            type: 'saveImage',
            data: true
          });
        }
      });
    } else {
      res.send({
        type: 'err',
        data: '意外错误E2，请稍后重试'
      })
    }
  });
});
export default router;
