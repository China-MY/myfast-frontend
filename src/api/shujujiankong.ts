// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取数据库监控信息 获取数据库基本监控信息 GET /api/v1/monitor/data/db */
export async function getDbInfoApiV1MonitorDataDbGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelDict_>('/api/v1/monitor/data/db', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取表详情 获取指定表的详细信息 GET /api/v1/monitor/data/table/${param0} */
export async function getTableDetailApiV1MonitorDataTableTableNameGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTableDetailApiV1MonitorDataTableTableNameGetParams,
  options?: { [key: string]: any }
) {
  const { table_name: param0, ...queryParams } = params
  return request<API.ResponseModelDict_>(`/api/v1/monitor/data/table/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取数据库表信息 获取数据库所有表信息 GET /api/v1/monitor/data/tables */
export async function getTableInfoApiV1MonitorDataTablesGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelListDict_>('/api/v1/monitor/data/tables', {
    method: 'GET',
    ...(options || {}),
  })
}
