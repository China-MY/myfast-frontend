import request from '@/utils/request';

// 获取Swagger JSON数据
export function getSwaggerJson() {
  return request({
    url: '/api/v1/tool/swagger/json',
    method: 'get'
  });
}
