// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取部门列表 获取所有部门列表 GET /api/v1/system/dept */
export async function listDeptsApiV1SystemDeptGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listDeptsApiV1SystemDeptGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelListDeptOut_>('/api/v1/system/dept', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 创建部门 创建新部门 POST /api/v1/system/dept */
export async function createDeptApiV1SystemDeptPost(
  body: API.DeptCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelDeptOut_>('/api/v1/system/dept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取部门详情 根据部门ID获取部门详情 GET /api/v1/system/dept/${param0} */
export async function getDeptApiV1SystemDeptDeptIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeptApiV1SystemDeptDeptIdGetParams,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<API.ResponseModelDeptOut_>(`/api/v1/system/dept/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新部门 更新部门信息 PUT /api/v1/system/dept/${param0} */
export async function updateDeptApiV1SystemDeptDeptIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDeptApiV1SystemDeptDeptIdPutParams,
  body: API.DeptUpdate,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<API.ResponseModelDeptOut_>(`/api/v1/system/dept/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除部门 删除指定部门 DELETE /api/v1/system/dept/${param0} */
export async function deleteDeptApiV1SystemDeptDeptIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDeptApiV1SystemDeptDeptIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dept/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取部门选项 获取部门树形选项 GET /api/v1/system/dept/select/options */
export async function getDeptOptionsApiV1SystemDeptSelectOptionsGet(options?: {
  [key: string]: any
}) {
  return request<API.ResponseModelListDeptTree_>('/api/v1/system/dept/select/options', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取部门树 获取部门树结构 GET /api/v1/system/dept/tree */
export async function getDeptTreeApiV1SystemDeptTreeGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelListDeptTree_>('/api/v1/system/dept/tree', {
    method: 'GET',
    ...(options || {}),
  })
}
