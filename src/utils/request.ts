import axios from 'axios'
export const baseURL = import.meta.env.VITE_APP_BASE_HTTP_URL
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use((config) => {
  config.headers["content-type"] = "application/x-www-form-urlencoded"
  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use((res) => res, err => {
  return Promise.reject(err)
})

export default (config) => {
  return instance(config)
} 