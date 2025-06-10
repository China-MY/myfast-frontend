import axios from 'axios'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'
import type { ApiResponse } from '@/types/user'

// 添加请求防抖功能
const pendingRequests = new Map<string, number>();
const REQUEST_TIMEOUT = 1000; // 1秒内相同请求不重复发送

// 生成请求唯一key
const getRequestKey = (config: AxiosRequestConfig) => {
  const { url, method, params, data } = config;
  return `${method || 'GET'}:${url || ''}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
};

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://localhost:8000', // 开发环境使用代理，生产环境直连
  timeout: 60000,
  withCredentials: false, // 跨域请求不携带凭证
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    console.log('发送请求:', config.url)
    
    // 获取请求唯一标识
    const requestKey = getRequestKey(config);
    
    // 排除注册和登录相关路径的防抖功能
    const isAuthPath = config.url?.includes('/api/v1/auth/');
    
    // 检查是否存在相同请求，如果相同请求在1秒内发出，则取消本次请求
    // 但注册和登录API不应该被防抖处理
    const existingTimestamp = pendingRequests.get(requestKey);
    if (!isAuthPath && existingTimestamp && Date.now() - existingTimestamp < REQUEST_TIMEOUT) {
      console.log('相同请求已存在，取消当前请求:', config.url);
      return Promise.reject(new Error('重复请求已取消'));
    }
    
    // 记录请求时间戳 (对非认证API)
    if (!isAuthPath) {
      pendingRequests.set(requestKey, Date.now());
      
      // 设置请求完成后自动从pendingRequests中移除
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, REQUEST_TIMEOUT);
    }
    
    // 获取token并添加到请求头，但注册请求不需要token
    if (!config.url?.includes('/api/v1/auth/register')) {
      const token = getToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return config
  },
  function (error) {
    console.error('请求拦截器错误:', error)
    // 直接返回错误，交给响应拦截器统一处理
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response: AxiosResponse) {
    try {
      const { data, status } = response
      console.log('收到响应状态码:', status)
      console.log('收到响应数据结构:', JSON.stringify(data))

      // 角色列表接口详细记录
      if (response.config.url?.includes('/api/v1/system/role/list')) {
        console.log('角色列表API返回:', {
          url: response.config.url,
          hasData: !!data,
          hasRows: data && !!data.rows,
          rowsType: data && data.rows ? typeof data.rows : 'undefined',
          isRowsArray: data && data.rows && Array.isArray(data.rows),
          rowsLength: data && data.rows && Array.isArray(data.rows) ? data.rows.length : 'N/A',
          hasCode: data && 'code' in data,
          code: data && 'code' in data ? data.code : 'N/A',
          structure: Object.keys(data || {}).join(', '),
        })
      }

      // 处理401未授权响应
      if (status === 401) {
        if (!window.location.pathname.includes('/login')) {
          console.log('响应401未授权, 当前路径:', window.location.pathname)
          // 清除token，放在错误处理中完成
          removeToken()
          // 重定向到登录页
          setTimeout(() => {
            const redirect = encodeURIComponent(window.location.pathname)
            router.push(`/login?redirect=${redirect}`)
          }, 100)
        }
        // 构造一个标准错误响应
        return Promise.reject({
          response: {
            status: 401,
            data: {
              code: 401,
              msg: '未授权，请重新登录',
              data: null
            }
          },
          message: '未授权，请重新登录'
        })
      }

      // 未登录
      if (data && data.code === 40100) {
        console.log('未登录状态, 当前路径:', window.location.pathname)
        // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
        if (!window.location.pathname.includes('/login')) {
          ElMessage.warning('请先登录')
          // 清除token
          removeToken()
          // 使用router进行导航而不是直接修改location
          const redirect = encodeURIComponent(window.location.pathname)
          router.push(`/login?redirect=${redirect}`)
        }
      }

      // API请求失败但服务器正常响应
      if (data && data.code && data.code !== 200) {
        // 只显示消息，但不阻止后续处理
        ElMessage.error(data.msg || '请求失败')
      }

      // 直接返回原始响应，保留axios的response结构，而不是只返回data
      return response
    } catch (err) {
      console.error('响应处理错误:', err)
      console.log('原始响应:', response)
      // 修改为返回修改后的响应对象，而不是直接返回一个新对象
      response.data = {
        code: 500,
        msg: '响应处理失败',
        data: null
      }
      return response
    }
  },
  function (error) {
    // 处理重复请求错误
    if (error.message === '重复请求已取消') {
      console.log('重复请求被拦截');
      // 返回一个空响应，不向用户显示错误信息
      return Promise.resolve({
        data: {
          code: 200,
          msg: '重复请求已忽略',
          data: null
        }
      });
    }

    // 响应错误处理
    console.log('API请求失败:', error.message || '未知错误');
    // 详细记录错误对象结构，帮助调试
    if (error.response) {
      console.log('错误响应状态码:', error.response.status);
      console.log('错误响应数据:', error.response.data);
    }

    let errorMessage = '未知错误'
    let statusCode = 500

    if (error.response) {
      // 服务器返回了错误状态码
      statusCode = error.response.status

      // 尝试从响应数据中获取详细错误信息
      if (error.response.data) {
        const responseData = error.response.data;
        
        // 检查常见的错误信息字段
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.msg) {
          errorMessage = responseData.msg;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
      }

      if (statusCode === 401) {
        errorMessage = errorMessage || '登录状态已过期，请重新登录'
        // 清除token
        removeToken()
        // 如果不在登录页，则跳转到登录页
        if (!window.location.pathname.includes('/login')) {
          ElMessage.error(errorMessage)
          // 使用router进行导航
          setTimeout(() => {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
          }, 100)
        }
      } else if (statusCode === 403) {
        errorMessage = errorMessage || '拒绝访问'
      } else if (statusCode === 404) {
        errorMessage = errorMessage || '请求的资源不存在'
      } else if (statusCode === 500) {
        errorMessage = errorMessage || '服务器错误，请联系管理员'
      } else if (statusCode === 400) {
        // 对于400错误，优先使用后端返回的错误信息
        errorMessage = errorMessage || '请求参数错误'
      } else {
        errorMessage = errorMessage || `请求失败: ${error.message}`
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      errorMessage = '网络错误，服务器无响应'
    } else if (error.message !== '重复请求已取消') {
      // 请求设置触发的错误，但忽略重复请求错误
      errorMessage = `请求错误: ${error.message}`
    }

    // 如果不是401错误(已在上面处理)和重复请求错误，则显示错误消息
    if (error.response?.status !== 401 && error.message !== '重复请求已取消') {
      ElMessage.error(errorMessage)
    }

    // 创建一个模拟的响应对象
    return Promise.resolve({
      data: {
        code: statusCode,
        msg: errorMessage,
        data: null
      },
      status: statusCode
    } as AxiosResponse)
  },
)

// 声明模块扩展类型
declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>;
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}

// 导出默认实例及类型
export default myAxios
