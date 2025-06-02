// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加菜单 添加菜单 POST /api/system/menu/add */
export async function addMenuApiSystemMenuAddPost(
  body: API.MenuCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/menu/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改菜单 修改菜单 PUT /api/system/menu/edit */
export async function editMenuApiSystemMenuEditPut(
  body: API.MenuUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/menu/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取菜单详情 获取菜单详情 GET /api/system/menu/info/${param0} */
export async function getMenuInfoApiSystemMenuInfoMenuIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMenuInfoApiSystemMenuInfoMenuIdGetParams,
  options?: { [key: string]: any }
) {
  const { menu_id: param0, ...queryParams } = params
  return request<any>(`/api/system/menu/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取菜单列表 获取菜单列表 GET /api/system/menu/list */
export async function getMenuListApiSystemMenuListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMenuListApiSystemMenuListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/menu/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 删除菜单 删除菜单 DELETE /api/system/menu/remove/${param0} */
export async function removeMenuApiSystemMenuRemoveMenuIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeMenuApiSystemMenuRemoveMenuIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { menu_id: param0, ...queryParams } = params
  return request<any>(`/api/system/menu/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取角色菜单树选择项 获取角色菜单树选择项 GET /api/system/menu/roleMenuTreeselect/${param0} */
export async function getRoleMenuTreeSelectApiSystemMenuRoleMenuTreeselectRoleIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleMenuTreeSelectApiSystemMenuRoleMenuTreeselectRoleIdGetParams,
  options?: { [key: string]: any }
) {
  const { role_id: param0, ...queryParams } = params
  return request<any>(`/api/system/menu/roleMenuTreeselect/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取路由信息 获取路由信息 GET /api/system/menu/routers */
export async function getRoutersApiSystemMenuRoutersGet(options?: { [key: string]: any }) {
  return request<any>('/api/system/menu/routers', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取菜单树选择项 获取菜单树选择项 GET /api/system/menu/treeselect */
export async function getMenuTreeSelectApiSystemMenuTreeselectGet(options?: {
  [key: string]: any
}) {
  return request<any>('/api/system/menu/treeselect', {
    method: 'GET',
    ...(options || {}),
  })
}
