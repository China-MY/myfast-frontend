import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message, Modal } from 'ant-design-vue';
import { getToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: '', // 不使用baseURL，API路径已包含完整路径
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 请求头添加token
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 如果响应直接返回数据
    if (response.status === 200) {
      return res;
    }

    message.error(res.msg || '请求失败');
    return Promise.reject(new Error(res.msg || '请求失败'));
  },
  (error) => {
    // 处理HTTP错误
    let errorMsg = '请求失败';

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorMsg = data.detail || '请求参数错误';
          break;
        case 401:
          errorMsg = '未授权，请重新登录';
          // 401未授权，清除用户信息并跳转到登录页
          Modal.confirm({
            title: '提示',
            content: '登录状态已过期，请重新登录',
            okText: '重新登录',
            cancelText: '取消',
            onOk: () => {
              // 可以在这里调用登出逻辑
              localStorage.removeItem('token');
              location.reload();
            }
          });
          break;
        case 403:
          errorMsg = '拒绝访问';
          break;
        case 404:
          errorMsg = '请求的资源不存在';
          break;
        case 500:
          errorMsg = '服务器内部错误';
          break;
        default:
          errorMsg = `请求失败: ${status}`;
      }
    } else if (error.request) {
      errorMsg = '服务器未响应';
    } else {
      errorMsg = error.message;
    }

    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default service;
