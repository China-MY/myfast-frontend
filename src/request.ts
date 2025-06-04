import axios from 'axios'
import { message } from 'ant-design-vue'
import { getToken, removeToken } from '@/utils/auth'

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000,
  withCredentials: false, // 跨域请求不携带凭证
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    console.log('发送请求:', config.url)
    // 获取token并添加到请求头
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        // !response.request.responseURL.includes('/get/login') &&
        !window.location.pathname.includes('/login')
      ) {
        message.warning('请先登录')
        window.location.href = `/login?redirect=${window.location.href}`
      }
    }
    return data
  },
  function (error) {
    // 响应错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status
      if (status === 401) {
        message.error('登录状态已过期，请重新登录')
        // 清除token并跳转到登录页
        removeToken()
        // 如果不在登录页，则跳转到登录页
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
          }, 1500)
        }
      } else if (status === 403) {
        message.error('拒绝访问')
      } else if (status === 404) {
        message.error('请求的资源不存在')
      } else if (status === 500) {
        message.error('服务器错误，请联系管理员')
      } else {
        message.error(`请求失败: ${error.message}`)
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message.error('网络错误，服务器无响应')
    } else {
      // 请求设置触发的错误
      message.error(`请求错误: ${error.message}`)
    }
    return Promise.reject(error)
  },
)

export default myAxios
