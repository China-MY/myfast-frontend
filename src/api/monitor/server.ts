import request from '@/utils/request';

// 获取服务器信息
export function getServerInfo() {
  return request({
    url: '/api/v1/monitor/server/info',
    method: 'get'
  });
}
