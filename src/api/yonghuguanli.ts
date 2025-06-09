// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Read Users 获取用户列表 GET /api/v1/system/user/ */
export async function readUsersApiV1SystemUserGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.readUsersApiV1SystemUserGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModelUser_>('/api/v1/system/user/', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** Create User 创建新用户 POST /api/v1/system/user/ */
export async function createUserApiV1SystemUserPost(
  body: API.UserCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelUser_>('/api/v1/system/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Read User 获取指定用户信息 GET /api/v1/system/user/${param0} */
export async function readUserApiV1SystemUserUserIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.readUserApiV1SystemUserUserIdGetParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ResponseModelUser_>(`/api/v1/system/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update User 更新用户信息 PUT /api/v1/system/user/${param0} */
export async function updateUserApiV1SystemUserUserIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserApiV1SystemUserUserIdPutParams,
  body: API.UserUpdate,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ResponseModelUser_>(`/api/v1/system/user/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete User 删除用户 DELETE /api/v1/system/user/${param0} */
export async function deleteUserApiV1SystemUserUserIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserApiV1SystemUserUserIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Reset Password 重置用户密码 PUT /api/v1/system/user/${param0}/reset-password */
export async function resetPasswordApiV1SystemUserUserIdResetPasswordPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.resetPasswordApiV1SystemUserUserIdResetPasswordPutParams,
  body: API.BodyResetPasswordApiV1SystemUser_userId_resetPasswordPut,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/user/${param0}/reset-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}
