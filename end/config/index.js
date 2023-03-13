import path from 'path'
import process from "process";

export const wsHost = 1001
export const httpHost = 1000
export const httpDomain = `http://127.0.0.1/${httpHost}`
// 聊天数据路径
export const infoDataPath = path.resolve('data/infoData.json')
// 用户ip数据路径
export const userDataPath = path.resolve('data/userData.json')
// 用户之间私聊的数据保存地址
export const privatePath = process.cwd() + '/data/private/'
// 图片保存地址
export const imgPath = process.cwd() + '/data/imgs/'
// 文件保存地址
export const filePath = process.cwd() + '/data/files/'
// 聊天加载条数
export const limits = 20

