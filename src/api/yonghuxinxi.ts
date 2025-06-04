// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Read User Me 获取当前用户信息 GET /api/v1/system/user/profile/ */
export async function readUserMeApiV1SystemUserProfileGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelUser_>('/api/v1/system/user/profile/', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Update User Me 更新当前用户信息 PUT /api/v1/system/user/profile/ */
export async function updateUserMeApiV1SystemUserProfilePut(
  body: API.UserUpdate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelUser_>('/api/v1/system/user/profile/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Update Password 更新当前用户密码 PUT /api/v1/system/user/profile/update-password */
export async function updatePasswordApiV1SystemUserProfileUpdatePasswordPut(
  body: API.BodyUpdatePasswordApiV1SystemUserProfileUpdatePasswordPut,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModel>('/api/v1/system/user/profile/update-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
