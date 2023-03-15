import fs from "fs";
import { userDataPath, infoDataPath, httpDomain, imgPath, filePath, limits } from "../config/index.js";

/** 初始化生成文件 */
export const createFs = () => {
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
  
}