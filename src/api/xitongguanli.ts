// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加参数配置 添加参数配置 POST /api/system/config/add */
export async function addConfigApiSystemConfigAddPost(
  body: API.ConfigCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/config/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改参数配置 修改参数配置 PUT /api/system/config/edit */
export async function editConfigApiSystemConfigEditPut(
  body: API.ConfigUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/config/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取参数配置详情 获取参数配置详情 GET /api/system/config/info/${param0} */
export async function getConfigInfoApiSystemConfigInfoConfigIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConfigInfoApiSystemConfigInfoConfigIdGetParams,
  options?: { [key: string]: any }
) {
  const { config_id: param0, ...queryParams } = params
  return request<any>(`/api/system/config/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 根据参数键名查询参数值 根据参数键名查询参数值 GET /api/system/config/key/${param0} */
export async function getConfigValueByKeyApiSystemConfigKeyConfigKeyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConfigValueByKeyApiSystemConfigKeyConfigKeyGetParams,
  options?: { [key: string]: any }
) {
  const { config_key: param0, ...queryParams } = params
  return request<any>(`/api/system/config/key/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取参数配置列表 获取参数配置列表（分页查询） GET /api/system/config/list */
export async function getConfigListApiSystemConfigListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConfigListApiSystemConfigListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/config/list', {
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

/** 删除参数配置 删除参数配置 DELETE /api/system/config/remove/${param0} */
export async function removeConfigApiSystemConfigRemoveConfigIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeConfigApiSystemConfigRemoveConfigIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { config_id: param0, ...queryParams } = params
  return request<any>(`/api/system/config/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 添加部门 添加部门 POST /api/system/dept/add */
export async function addDeptApiSystemDeptAddPost(
  body: API.DeptCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dept/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改部门 修改部门 PUT /api/system/dept/edit */
export async function editDeptApiSystemDeptEditPut(
  body: API.DeptUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dept/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取部门详情 获取部门详情 GET /api/system/dept/info/${param0} */
export async function getDeptInfoApiSystemDeptInfoDeptIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeptInfoApiSystemDeptInfoDeptIdGetParams,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dept/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取部门列表 获取部门列表 GET /api/system/dept/list */
export async function getDeptListApiSystemDeptListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeptListApiSystemDeptListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dept/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 删除部门 删除部门 DELETE /api/system/dept/remove/${param0} */
export async function removeDeptApiSystemDeptRemoveDeptIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeDeptApiSystemDeptRemoveDeptIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dept/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取部门树选择数据 获取部门树选择数据 GET /api/system/dept/treeselect */
export async function getDeptTreeSelectApiSystemDeptTreeselectGet(options?: {
  [key: string]: any
}) {
  return request<any>('/api/system/dept/treeselect', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 添加字典数据 添加字典数据 POST /api/system/dict/data/add */
export async function addDictDataApiSystemDictDataAddPost(
  body: API.DictDataCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/data/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改字典数据 修改字典数据 PUT /api/system/dict/data/edit */
export async function editDictDataApiSystemDictDataEditPut(
  body: API.DictDataUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/data/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取字典数据详情 获取字典数据详情 GET /api/system/dict/data/info/${param0} */
export async function getDictDataInfoApiSystemDictDataInfoDictCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataInfoApiSystemDictDataInfoDictCodeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/data/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取字典数据列表 获取字典数据列表（分页查询） GET /api/system/dict/data/list */
export async function getDictDataListApiSystemDictDataListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataListApiSystemDictDataListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/data/list', {
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

/** 删除字典数据 删除字典数据 DELETE /api/system/dict/data/remove/${param0} */
export async function removeDictDataApiSystemDictDataRemoveDictCodeDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeDictDataApiSystemDictDataRemoveDictCodeDeleteParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/data/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 根据字典类型获取字典数据 根据字典类型获取字典数据 GET /api/system/dict/data/type/${param0} */
export async function getDictDataByTypeApiSystemDictDataTypeDictTypeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataByTypeApiSystemDictDataTypeDictTypeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_type: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/data/type/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 添加字典类型 添加字典类型 POST /api/system/dict/type/add */
export async function addDictTypeApiSystemDictTypeAddPost(
  body: API.DictTypeCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/type/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改字典类型 修改字典类型 PUT /api/system/dict/type/edit */
export async function editDictTypeApiSystemDictTypeEditPut(
  body: API.DictTypeUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/type/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取字典类型详情 获取字典类型详情 GET /api/system/dict/type/info/${param0} */
export async function getDictTypeInfoApiSystemDictTypeInfoDictIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictTypeInfoApiSystemDictTypeInfoDictIdGetParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/type/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取字典类型列表 获取字典类型列表（分页查询） GET /api/system/dict/type/list */
export async function getDictTypeListApiSystemDictTypeListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictTypeListApiSystemDictTypeListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/type/list', {
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

/** 删除字典类型 删除字典类型 DELETE /api/system/dict/type/remove/${param0} */
export async function removeDictTypeApiSystemDictTypeRemoveDictIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeDictTypeApiSystemDictTypeRemoveDictIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/type/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

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

/** 添加岗位 添加岗位 POST /api/system/post/add */
export async function addPostApiSystemPostAddPost(
  body: API.PostCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改岗位 修改岗位 PUT /api/system/post/edit */
export async function editPostApiSystemPostEditPut(
  body: API.PostUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/post/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取岗位详情 获取岗位详情 GET /api/system/post/info/${param0} */
export async function getPostInfoApiSystemPostInfoPostIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostInfoApiSystemPostInfoPostIdGetParams,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<any>(`/api/system/post/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取岗位列表 获取岗位列表（分页查询） GET /api/system/post/list */
export async function getPostListApiSystemPostListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostListApiSystemPostListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/post/list', {
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

/** 删除岗位 删除岗位 DELETE /api/system/post/remove/${param0} */
export async function removePostApiSystemPostRemovePostIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removePostApiSystemPostRemovePostIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<any>(`/api/system/post/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

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

/** 添加用户 添加用户 POST /api/system/user/add */
export async function addUserApiSystemUserAddPost(
  body: API.UserCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改用户 修改用户 PUT /api/system/user/edit */
export async function editUserApiSystemUserEditPut(
  body: API.UserUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/user/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取用户详情 获取用户详情 GET /api/system/user/info/${param0} */
export async function getUserInfoApiSystemUserInfoUserIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInfoApiSystemUserInfoUserIdGetParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<any>(`/api/system/user/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取用户列表 获取用户列表（分页查询） GET /api/system/user/list */
export async function getUserListApiSystemUserListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserListApiSystemUserListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/user/list', {
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

/** 删除用户 删除用户 DELETE /api/system/user/remove/${param0} */
export async function removeUserApiSystemUserRemoveUserIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeUserApiSystemUserRemoveUserIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<any>(`/api/system/user/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 重置用户密码 重置用户密码 PUT /api/system/user/resetPwd */
export async function resetUserPasswordApiSystemUserResetPwdPut(
  body: API.BodyResetUserPasswordApiSystemUserResetPwdPut,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/user/resetPwd', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
