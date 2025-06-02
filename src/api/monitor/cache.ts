import request from '@/utils/request';

// 获取缓存信息
export function getCacheInfo() {
  return request({
    url: '/api/v1/monitor/cache/info',
    method: 'get'
  });
}

// 获取缓存键名列表
export function getCacheKeys(params: {
  pattern: string;
  page_num: number;
  page_size: number;
}) {
  return request({
    url: '/api/v1/monitor/cache/keys',
    method: 'get',
    params
  });
}

// 获取缓存键值详情
export function getCacheValue(key: string) {
  return request({
    url: `/api/v1/monitor/cache/value/${encodeURIComponent(key)}`,
    method: 'get'
  });
}

// 删除缓存键
export function deleteCacheKey(key: string) {
  return request({
    url: `/api/v1/monitor/cache/delete/${encodeURIComponent(key)}`,
    method: 'delete'
  });
}
