import request from "../utils/request"
/**
 * @param name 用户名
 * @returns axios
 */
export const setUserName = (name: string) => {
  return request({
    url: 'setUserName',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data: {
      name
    }
  })
}

/**
 * @param name 用户名
 * @returns axios
 */
export const getUserName = (name: string) => {
  return request({
    url: 'getUserName',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data: {
      name
    }
  })
}

/**
 * 获取更多数据
 * @param name 用户名
 * @returns axios
 */
export const loadMoreInfo = (data: {}) => {
  return request({
    url: 'loadMoreInfo',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data
  })
}

/**
 * @param userName 用户名
 * @param data 图片base64编码
 */
export const uploadImageBase64 = (userName: string, data: obj) => {
  // const file = new File([data], 'imageBase64')
  const formData = new FormData()
  formData.append('userName', userName)
  formData.append('imageWidth', data.imageWidth)
  formData.append('imageHeight', data.imageHeight)
  formData.append('imageBase64', data.compressPic)
  return request({
    url: 'uploadImg',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data: formData
  })
}

/**
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