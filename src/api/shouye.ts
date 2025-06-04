// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Root 根路由，返回系统信息 GET / */
export async function rootGet(options?: { [key: string]: any }) {
  return request<any>('/', {
    method: 'GET',
    ...(options || {}),
  })
}
