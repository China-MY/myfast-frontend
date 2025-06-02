// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取服务器信息 获取服务器信息（CPU、内存、磁盘、系统等信息） GET /api/monitor/server/info */
export async function getServerInfoApiMonitorServerInfoGet(options?: { [key: string]: any }) {
  return request<any>('/api/monitor/server/info', {
    method: 'GET',
    ...(options || {}),
  })
}
