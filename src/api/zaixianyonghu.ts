// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 强制退出登录 强制用户退出登录 DELETE /api/v1/monitor/online/${param0} */
export async function forceLogoutApiV1MonitorOnlineTokenDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.forceLogoutApiV1MonitorOnlineTokenDeleteParams,
  options?: { [key: string]: any }
) {
  const { token: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/monitor/online/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 批量强制退出 批量强制用户退出登录 POST /api/v1/monitor/online/batchLogout */
export async function batchForceLogoutApiV1MonitorOnlineBatchLogoutPost(
  body: API.ForceLogoutParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModel>('/api/v1/monitor/online/batchLogout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取在线用户列表 分页获取在线用户列表 GET /api/v1/monitor/online/list */
export async function listOnlineUsersApiV1MonitorOnlineListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOnlineUsersApiV1MonitorOnlineListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModelListOnlineUserOut_>('/api/v1/monitor/online/list', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',
      ...params,
    },
    ...(options || {}),
  })
}
