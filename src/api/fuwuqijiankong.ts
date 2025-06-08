// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取服务器信息 获取服务器基本信息 GET /api/v1/monitor/server */
export async function getServerInfoApiV1MonitorServerGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelServerInfo_>('/api/v1/monitor/server', {
    method: 'GET',
    ...(options || {}),
  })
}
