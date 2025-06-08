// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 清空缓存 清空所有缓存 DELETE /api/v1/monitor/cache/clear */
export async function clearCacheApiV1MonitorCacheClearDelete(options?: { [key: string]: any }) {
  return request<API.ResponseModel>('/api/v1/monitor/cache/clear', {
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 获取缓存信息 获取缓存基本信息 GET /api/v1/monitor/cache/info */
export async function getCacheInfoApiV1MonitorCacheInfoGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelDict_>('/api/v1/monitor/cache/info', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 删除缓存 删除指定键名的缓存 DELETE /api/v1/monitor/cache/key/${param0} */
export async function deleteCacheApiV1MonitorCacheKeyKeyDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCacheApiV1MonitorCacheKeyKeyDeleteParams,
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/monitor/cache/key/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取缓存键名列表 获取所有缓存键名列表 GET /api/v1/monitor/cache/keys */
export async function getCacheKeysApiV1MonitorCacheKeysGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelListStr_>('/api/v1/monitor/cache/keys', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取缓存值 根据键名获取缓存值 GET /api/v1/monitor/cache/value/${param0} */
export async function getCacheValueApiV1MonitorCacheValueKeyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCacheValueApiV1MonitorCacheValueKeyGetParams,
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/monitor/cache/value/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}
