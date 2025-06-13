// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Get Table Detail 获取表详情 GET /api/v1/tool/gen/${param0} */
export async function getTableDetailApiV1ToolGenIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTableDetailApiV1ToolGenIdGetParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.GenTableDetail>(`/api/v1/tool/gen/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Table 更新表信息 PUT /api/v1/tool/gen/${param0} */
export async function updateTableApiV1ToolGenIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateTableApiV1ToolGenIdPutParams,
  body: API.GenTableUpdate,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.GenTableInDB>(`/api/v1/tool/gen/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete Table 删除表信息 DELETE /api/v1/tool/gen/${param0} */
export async function deleteTableApiV1ToolGenIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTableApiV1ToolGenIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.GenTableInDB>(`/api/v1/tool/gen/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Table Columns 更新表字段信息 PUT /api/v1/tool/gen/${param0}/columns */
export async function updateTableColumnsApiV1ToolGenIdColumnsPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateTableColumnsApiV1ToolGenIdColumnsPutParams,
  body: API.GenTableColumnUpdate[],
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.GenTableColumnInDB[]>(`/api/v1/tool/gen/${param0}/columns`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Generate Code 生成代码 GET /api/v1/tool/gen/${param0}/generate */
export async function generateCodeApiV1ToolGenIdGenerateGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.generateCodeApiV1ToolGenIdGenerateGetParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<any>(`/api/v1/tool/gen/${param0}/generate`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Preview Code 预览代码 GET /api/v1/tool/gen/${param0}/preview */
export async function previewCodeApiV1ToolGenIdPreviewGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.previewCodeApiV1ToolGenIdPreviewGetParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.PreviewCodeItem[]>(`/api/v1/tool/gen/${param0}/preview`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Batch Delete Tables 批量删除表信息 DELETE /api/v1/tool/gen/batch */
export async function batchDeleteTablesApiV1ToolGenBatchDelete(
  body: API.BodyBatchDeleteTablesApiV1ToolGenBatchDelete,
  options?: { [key: string]: any }
) {
  return request<API.GenTableInDB[]>('/api/v1/tool/gen/batch', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Batch Generate Code 批量生成代码 POST /api/v1/tool/gen/batch/generate */
export async function batchGenerateCodeApiV1ToolGenBatchGeneratePost(
  body: API.BodyBatchGenerateCodeApiV1ToolGenBatchGeneratePost,
  options?: { [key: string]: any }
) {
  return request<any>('/api/v1/tool/gen/batch/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: body,
    ...(options || {}),
  })
}

/** Import Tables 导入表结构 POST /api/v1/tool/gen/import */
export async function importTablesApiV1ToolGenImportPost(
  body: API.ImportTableRequest,
  options?: { [key: string]: any }
) {
  return request<API.GenTableInDB[]>('/api/v1/tool/gen/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Table List 获取代码生成表列表 GET /api/v1/tool/gen/list */
export async function getTableListApiV1ToolGenListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTableListApiV1ToolGenListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.GenTableInDB[]>('/api/v1/tool/gen/list', {
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

/** Get Db Tables 获取数据库表列表 GET /api/v1/tool/gen/tables */
export async function getDbTablesApiV1ToolGenTablesGet(options?: { [key: string]: any }) {
  return request<API.TableListItem[]>('/api/v1/tool/gen/tables', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Get Table Total 获取代码生成表总数 GET /api/v1/tool/gen/total */
export async function getTableTotalApiV1ToolGenTotalGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTableTotalApiV1ToolGenTotalGetParams,
  options?: { [key: string]: any }
) {
  return request<number>('/api/v1/tool/gen/total', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
