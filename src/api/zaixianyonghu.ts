// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 批量强制退出 批量强制退出在线用户 DELETE /api/monitor/online/batchLogout */
export async function batchLogoutApiMonitorOnlineBatchLogoutDelete(
  body: API.BodyBatchLogoutApiMonitorOnlineBatchLogoutDelete,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/online/batchLogout', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取在线用户列表 获取在线用户列表（分页查询） GET /api/monitor/online/list */
export async function getOnlineUserListApiMonitorOnlineListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOnlineUserListApiMonitorOnlineListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/online/list', {
    method: 'GET',
    params: {
      // page_num has a default value: 1
      page_num: '1',
      // page_size has a default value: 10
      page_size: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 强制退出在线用户 强制退出在线用户 DELETE /api/monitor/online/remove/${param0} */
export async function forceLogoutApiMonitorOnlineRemoveOnlineIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.forceLogoutApiMonitorOnlineRemoveOnlineIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { online_id: param0, ...queryParams } = params
  return request<any>(`/api/monitor/online/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}
