// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建角色 创建新角色 POST /api/v1/system/role */
export async function createRoleApiV1SystemRolePost(
  body: API.RoleCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelRoleOut_>('/api/v1/system/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取角色详情 根据角色ID获取角色详情 GET /api/v1/system/role/${param0} */
export async function getRoleApiV1SystemRoleRoleIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleApiV1SystemRoleRoleIdGetParams,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<any>(`/api/v1/system/role/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新角色 更新角色信息 PUT /api/v1/system/role/${param0} */
export async function updateRoleApiV1SystemRoleRoleIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateRoleApiV1SystemRoleRoleIdPutParams,
  body: API.RoleUpdate,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<API.ResponseModelRoleOut_>(`/api/v1/system/role/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除角色 删除指定角色 DELETE /api/v1/system/role/${param0} */
export async function deleteRoleApiV1SystemRoleRoleIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRoleApiV1SystemRoleRoleIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/role/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取角色列表 分页获取角色列表 GET /api/v1/system/role/list */
export async function listRolesApiV1SystemRoleListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRolesApiV1SystemRoleListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/v1/system/role/list', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: params.page || 1,
      // page_size has a default value: 10
      page_size: params.page_size || 10,
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取角色选项 获取角色选项列表 GET /api/v1/system/role/select/options */
export async function getRoleOptionsApiV1SystemRoleSelectOptionsGet(options?: {
  [key: string]: any
}) {
  return request<API.ResponseModelListRoleOut_>('/api/v1/system/role/select/options', {
    method: 'GET',
    ...(options || {}),
  })
}
