// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 清空当前数据库 清空当前数据库 DELETE /api/monitor/cache/flushdb */
export async function flushDbApiMonitorCacheFlushdbDelete(options?: { [key: string]: any }) {
  return request<any>('/api/monitor/cache/flushdb', {
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 获取Redis服务信息 获取Redis服务器信息 GET /api/monitor/cache/info */
export async function getRedisInfoApiMonitorCacheInfoGet(options?: { [key: string]: any }) {
  return request<any>('/api/monitor/cache/info', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取Redis键值 获取Redis键值 GET /api/monitor/cache/key/${param0} */
export async function getRedisKeyValueApiMonitorCacheKeyKeyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRedisKeyValueApiMonitorCacheKeyKeyGetParams,
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params
  return request<any>(`/api/monitor/cache/key/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 删除Redis键 删除Redis键 DELETE /api/monitor/cache/key/${param0} */
export async function deleteRedisKeyApiMonitorCacheKeyKeyDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRedisKeyApiMonitorCacheKeyKeyDeleteParams,
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params
  return request<any>(`/api/monitor/cache/key/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取Redis键列表 获取Redis键列表 GET /api/monitor/cache/keys */
export async function getRedisKeysApiMonitorCacheKeysGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRedisKeysApiMonitorCacheKeysGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/cache/keys', {
    method: 'GET',
    params: {
      // pattern has a default value: *
      pattern: '*',
      // limit has a default value: 100
      limit: '100',
      ...params,
    },
    ...(options || {}),
  })
}
