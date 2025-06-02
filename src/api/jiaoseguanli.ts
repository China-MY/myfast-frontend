// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加角色 添加角色 POST /api/system/role/add */
export async function addRoleApiSystemRoleAddPost(
  body: API.RoleCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/role/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取所有角色 获取所有角色列表（不分页） GET /api/system/role/all */
export async function getAllRoleListApiSystemRoleAllGet(options?: { [key: string]: any }) {
  return request<any>('/api/system/role/all', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 修改角色状态 修改角色状态 PUT /api/system/role/changeStatus */
export async function changeRoleStatusApiSystemRoleChangeStatusPut(
  body: API.BodyChangeRoleStatusApiSystemRoleChangeStatusPut,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/role/changeStatus', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改角色 修改角色 PUT /api/system/role/edit */
export async function editRoleApiSystemRoleEditPut(
  body: API.RoleUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/role/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取角色详情 获取角色详情 GET /api/system/role/info/${param0} */
export async function getRoleInfoApiSystemRoleInfoRoleIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleInfoApiSystemRoleInfoRoleIdGetParams,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<any>(`/api/system/role/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取角色列表 获取角色列表（分页查询） GET /api/system/role/list */
export async function getRoleListApiSystemRoleListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleListApiSystemRoleListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/role/list', {
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

/** 删除角色 删除角色 DELETE /api/system/role/remove/${param0} */
export async function removeRoleApiSystemRoleRemoveRoleIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeRoleApiSystemRoleRemoveRoleIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<any>(`/api/system/role/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}
