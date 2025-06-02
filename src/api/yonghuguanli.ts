// @ts-ignore
/* eslint-disable */
import request from '@/request'

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
