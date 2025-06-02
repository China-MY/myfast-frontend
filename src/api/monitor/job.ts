import request from '@/utils/request';

// 获取定时任务列表
export function getJobList(params: {
  job_name?: string;
  job_group?: string;
  status?: string;
  page_num: number;
  page_size: number;
}) {
  return request({
    url: '/api/v1/monitor/job/list',
    method: 'get',
    params
  });
}

// 获取定时任务详情
export function getJobInfo(job_id: number) {
  return request({
    url: `/api/v1/monitor/job/info/${job_id}`,
    method: 'get'
  });
}

// 添加定时任务
export function addJob(data: {
  job_name: string;
  job_group: string;
  invoke_target: string;
  cron_expression: string;
  misfire_policy: string;
  concurrent: string;
  status: string;
  remark?: string;
}) {
  return request({
    url: '/api/v1/monitor/job/add',
    method: 'post',
    data
  });
}

// 修改定时任务
export function updateJob(data: {
  job_id: number;
  job_name: string;
  job_group: string;
  invoke_target: string;
  cron_expression: string;
  misfire_policy: string;
  concurrent: string;
  status: string;
  remark?: string;
}) {
  return request({
    url: '/api/v1/monitor/job/edit',
    method: 'put',
    data
  });
}

// 删除定时任务
export function deleteJob(job_id: number) {
  return request({
    url: `/api/v1/monitor/job/remove/${job_id}`,
    method: 'delete'
  });
}

// 运行一次定时任务
export function runJob(job_id: number) {
  return request({
    url: `/api/v1/monitor/job/run/${job_id}`,
    method: 'put'
  });
}

// 更改任务状态
export function changeJobStatus(job_id: number, status: string) {
  return request({
    url: `/api/v1/monitor/job/status/${job_id}/${status}`,
    method: 'put'
  });
}
