// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加定时任务 添加定时任务 POST /api/monitor/job/add */
export async function addJobApiMonitorJobAddPost(
  body: API.JobCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/job/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改任务状态 修改任务状态 PUT /api/monitor/job/changeStatus */
export async function changeStatusApiMonitorJobChangeStatusPut(
  body: API.BodyChangeStatusApiMonitorJobChangeStatusPut,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/job/changeStatus', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改定时任务 修改定时任务 PUT /api/monitor/job/edit */
export async function editJobApiMonitorJobEditPut(
  body: API.JobUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/job/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取定时任务详情 获取定时任务详情 GET /api/monitor/job/info/${param0} */
export async function getJobInfoApiMonitorJobInfoJobIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobInfoApiMonitorJobInfoJobIdGetParams,
  options?: { [key: string]: any }
) {
  const { job_id: param0, ...queryParams } = params
  return request<any>(`/api/monitor/job/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取定时任务列表 获取定时任务列表（分页查询） GET /api/monitor/job/list */
export async function getJobListApiMonitorJobListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobListApiMonitorJobListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/job/list', {
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

/** 清空定时任务日志 清空定时任务日志 DELETE /api/monitor/job/log/clean */
export async function cleanAllJobLogsApiMonitorJobLogCleanDelete(options?: { [key: string]: any }) {
  return request<any>('/api/monitor/job/log/clean', {
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 获取定时任务日志列表 获取定时任务日志列表（分页查询） GET /api/monitor/job/log/list */
export async function getJobLogListApiMonitorJobLogListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobLogListApiMonitorJobLogListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/job/log/list', {
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

/** 删除定时任务 删除定时任务 DELETE /api/monitor/job/remove/${param0} */
export async function removeJobApiMonitorJobRemoveJobIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeJobApiMonitorJobRemoveJobIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { job_id: param0, ...queryParams } = params
  return request<any>(`/api/monitor/job/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 立即执行一次 立即执行一次任务 PUT /api/monitor/job/run */
export async function executeJobApiMonitorJobRunPut(
  body: API.BodyExecuteJobApiMonitorJobRunPut,
  options?: { [key: string]: any }
) {
  return request<any>('/api/monitor/job/run', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
