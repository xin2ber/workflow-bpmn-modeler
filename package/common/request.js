/**
 * ajax请求配置
 */
import axios from 'axios'
import { Message } from 'element-ui'

// axios默认配置
axios.defaults.timeout = 10000 // 超时时间
axios.defaults.baseURL = ''

// 整理数据
axios.defaults.transformRequest = function(data) {
  data = JSON.stringify(data)
  return data
}

// 路由请求拦截
axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)

// 路由响应拦截
axios.interceptors.response.use(
  response => {
    if (response.code === 1) {
      return Message.error(response.msg)
    } else {
      return response.data
    }
  },
  error => {
    return Promise.reject(error.response) // 返回接口返回的错误信息
  }
)
export default axios
