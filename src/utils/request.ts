import axios from 'axios';

// create an axios instance
const service = axios.create({
  // 根据生产环境和开发环境去更改发送地址
  baseURL:
    process.env.NODE_ENV === 'production'
      ? import.meta.env.VITE_APP_DEV_BASE_HTTP_URL
      : import.meta.env.VITE_APP_PROD_BASE_HTTP_URL, // url = base url + request url
  //withCredentials: true, // send cookies when cross-domain requests 注意：withCredentials和后端配置的cross跨域不可同时使用
  timeout: 6000, // request timeout
  crossDomain: true,
});

// request拦截器,在请求之前做一些处理
service.interceptors.request.use(
  (config) => {
    // if (store.state.token) {
    //     // 给请求头添加user-token
    //     config.headers["user-token"] = store.state.token;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//配置成功后的拦截器
service.interceptors.response.use(
  (res) => {
    if (res.status == 200) {
      return res.data;
    } else {
      return Promise.reject(res.data.msg);
    }
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  },
);
export default service;
