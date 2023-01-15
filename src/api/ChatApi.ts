import axios from 'axios'
const baseUrl = 'http://47.95.112.111:1000/'
/**
 * 
 * @param name 用户名
 * @returns axios
 */
export const setUserName = (name: string) => {
  return axios({
    url: baseUrl + 'setUserName',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data: {
      name
    }
  })
}

/**
 * 
 * @param name 用户名
 * @returns axios
 */
export const getUserName = (name: string) => {
  return axios({
    url: baseUrl + 'getUserName',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data: {
      name
    }
  })
}

/**
 * 
 * @param userName 用户名
 * @param data 图片base64编码
 */
export const uploadImageBase64 = (userName: string, data: string) => {
  // const file = new File([data], 'imageBase64')
  const formData = new FormData()
  formData.append('userName', userName)
  formData.append('imageBase64', data)
  return axios({
    url: baseUrl + 'uploadImg',
    method: 'post',
    headers: { "content-type": "application/x-www-form-urlencoded"},
    data: formData
  })
}