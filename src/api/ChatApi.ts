import request from "@/utils/request"
import { loadMoreInfoType, uploadImageBase64Type } from '@/types/chatApiType'
/**
 * 设置用户名
 * @param name 用户名
 * @returns axios
 */
export const setUserName = (name: string) => {
  return request({
    url: 'setUserName',
    method: 'post',
    data: {
      name
    }
  })
}

/**
 * 获取用户名
 * @param name 用户名
 * @returns axios
 */
export const getUserName = (name: string) => {
  return request({
    url: 'getUserName',
    method: 'post',
    data: {
      name
    }
  })
}

/**
 * 获取更多数据
 * @param data (page, limit)
 * @returns axiosRes
 */
export const loadMoreInfo = (data: loadMoreInfoType) => {
  return request({
    url: 'loadMoreInfo',
    method: 'post',
    data
  })
}

/**
 * 发送图片
 * @param userName 用户名
 * @param data ( imageWidth, imageHeight, compressPic )
 * @returns axios
 */
export const uploadImageBase64 = (userName: string, data: uploadImageBase64Type) => {
  const formData = new FormData()
  formData.append('userName', userName)
  formData.append('imageWidth', String(data.imageWidth))
  formData.append('imageHeight', String(data.imageHeight))
  formData.append('imageBase64', data.compressPic)
  return request({
    url: 'uploadImg',
    method: 'post',
    data: formData
  })
}

/**
 * 发送文件
 * @param userName 用户名
 * @param data 文件对象
 * @returns axios
 */
export const uploadFormFile = (userName: string, data: File) => {
  const formData = new FormData()
  formData.append('userName', userName)
  formData.append('fileData', data, data.name)
  
  return request({
    url: 'uploadFile',
    method: 'post',
    headers: { 'Content-type' : 'multipart/form-data' },
    data: formData
  })
}