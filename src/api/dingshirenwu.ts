// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建定时任务 创建新定时任务 POST /api/v1/monitor/job */
export async function createJobApiV1MonitorJobPost(
  body: API.JobCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelJobOut_>('/api/v1/monitor/job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取定时任务详情 根据任务ID获取定时任务详情 GET /api/v1/monitor/job/${param0} */
export async function getJobApiV1MonitorJobJobIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getJobApiV1MonitorJobJobIdGetParams,
  options?: { [key: string]: any }
) {
  const { job_id: param0, ...queryParams } = params
  return request<API.ResponseModelJobOut_>(`/api/v1/monitor/job/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新定时任务 更新定时任务信息 PUT /api/v1/monitor/job/${param0} */
export async function updateJobApiV1MonitorJobJobIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateJobApiV1MonitorJobJobIdPutParams,
  body: API.JobUpdate,
  options?: { [key: string]: any }
) {
  const { job_id: param0, ...queryParams } = params
  return request<API.ResponseModelJobOut_>(`/api/v1/monitor/job/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除定时任务 删除指定定时任务 DELETE /api/v1/monitor/job/${param0} */
export async function deleteJobApiV1MonitorJobJobIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteJobApiV1MonitorJobJobIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { job_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/monitor/job/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 执行定时任务 立即执行一次定时任务 POST /api/v1/monitor/job/${param0}/run */
export async function runJobApiV1MonitorJobJobIdRunPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.runJobApiV1MonitorJobJobIdRunPostParams,
  options?: { [key: string]: any }
) {
  const { job_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/monitor/job/${param0}/run`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 修改任务状态 修改定时任务状态 PUT /api/v1/monitor/job/${param0}/status/${param1} */
export async function changeJobStatusApiV1MonitorJobJobIdStatusStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.changeJobStatusApiV1MonitorJobJobIdStatusStatusPutParams,
  options?: { [key: string]: any }
) {
  const { job_id: param0, status: param1, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/monitor/job/${param0}/status/${param1}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取定时任务列表 分页获取定时任务列表 GET /api/v1/monitor/job/list */
export async function listJobsApiV1MonitorJobListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listJobsApiV1MonitorJobListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/v1/monitor/job/list', {
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

/** 清空任务日志 清空所有定时任务日志 DELETE /api/v1/monitor/job/log/clean */
export async function cleanJobLogsApiV1MonitorJobLogCleanDelete(options?: { [key: string]: any }) {
  return request<API.ResponseModel>('/api/v1/monitor/job/log/clean', {
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 获取任务日志列表 分页获取定时任务日志列表 GET /api/v1/monitor/job/log/list */
export async function listJobLogsApiV1MonitorJobLogListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listJobLogsApiV1MonitorJobLogListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/v1/monitor/job/log/list', {
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
