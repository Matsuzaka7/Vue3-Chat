import axios from 'axios'
const baseUrl = 'http://127.0.0.1:1000/'
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