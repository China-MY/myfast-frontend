// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Health Check 健康检查接口 GET /health */
export async function healthCheckHealthGet(options?: { [key: string]: any }) {
  return request<any>('/health', {
    method: 'GET',
    ...(options || {}),
  })
}
