import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
import { useUserStore } from '@/stores/modules/user'
import { getToken, removeToken } from '@/utils/auth'

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 60000,
  withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 添加token到请求头
    const token = getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    message.error('请求发送失败')
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    
    // 如果接口请求成功
    if (data.code === 200) {
      return data
    }
    
    // 未登录或token过期
    if (data.code === 40100 || data.code === 40101) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning(data.message || '请先登录')
        const userStore = useUserStore()
        userStore.logout()
        removeToken()
        router.push(`/user/login?redirect=${encodeURIComponent(window.location.href)}`)
      }
    } else if (data.code !== 200) {
      // 其他错误情况
      message.error(data.message || '服务器异常')
    }
    
    return response
  },
  function (error) {
    let errorMsg = '网络异常，请稍后重试'
    
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 403:
          errorMsg = '禁止访问'
          break
        case 404:
          errorMsg = '请求的资源不存在'
          break
        case 500:
          errorMsg = '服务器内部错误'
          break
        default:
          errorMsg = error.message || '未知错误'
      }
    }
    
    message.error(errorMsg)
    return Promise.reject(error)
  },
)

// 封装请求方法
export const request = {
  get: (url: string, params?: any) => myAxios.get(url, { params }),
  post: (url: string, data?: any) => myAxios.post(url, data),
  put: (url: string, data?: any) => myAxios.put(url, data),
  delete: (url: string, params?: any) => myAxios.delete(url, { params }),
}

export default myAxios
