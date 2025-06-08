// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取菜单列表 获取所有菜单列表 GET /api/v1/system/menu */
export async function listMenusApiV1SystemMenuGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMenusApiV1SystemMenuGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelListMenuOut_>('/api/v1/system/menu', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 创建菜单 创建新菜单 POST /api/v1/system/menu */
export async function createMenuApiV1SystemMenuPost(
  body: API.MenuCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelMenuOut_>('/api/v1/system/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取菜单详情 根据菜单ID获取菜单详情 GET /api/v1/system/menu/${param0} */
export async function getMenuApiV1SystemMenuMenuIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMenuApiV1SystemMenuMenuIdGetParams,
  options?: { [key: string]: any }
) {
  const { menu_id: param0, ...queryParams } = params
  return request<API.ResponseModelMenuOut_>(`/api/v1/system/menu/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新菜单 更新菜单信息 PUT /api/v1/system/menu/${param0} */
export async function updateMenuApiV1SystemMenuMenuIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMenuApiV1SystemMenuMenuIdPutParams,
  body: API.MenuUpdate,
  options?: { [key: string]: any }
) {
  const { menu_id: param0, ...queryParams } = params
  return request<API.ResponseModelMenuOut_>(`/api/v1/system/menu/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除菜单 删除指定菜单 DELETE /api/v1/system/menu/${param0} */
export async function deleteMenuApiV1SystemMenuMenuIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMenuApiV1SystemMenuMenuIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { menu_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/menu/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取角色菜单 获取角色关联的菜单列表 GET /api/v1/system/menu/role/${param0} */
export async function getRoleMenusApiV1SystemMenuRoleRoleIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleMenusApiV1SystemMenuRoleRoleIdGetParams,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<any>(`/api/v1/system/menu/role/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取菜单树 获取菜单树结构 GET /api/v1/system/menu/tree */
export async function getMenuTreeApiV1SystemMenuTreeGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelListMenuTree_>('/api/v1/system/menu/tree', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取用户菜单 获取当前用户可访问的菜单 GET /api/v1/system/menu/user */
export async function getUserMenusApiV1SystemMenuUserGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelListMenuTree_>('/api/v1/system/menu/user', {
    method: 'GET',
    ...(options || {}),
  })
}
