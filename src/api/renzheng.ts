// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 退出登录 用户退出系统登录 POST /api/v1/auth */
export async function logoutApiV1AuthPost(options?: { [key: string]: any }) {
  return request<API.ResponseModel>('/api/v1/auth', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 系统账号登录 使用用户名密码登录系统，获取访问令牌 POST /api/v1/auth/account */
export async function loginAccountApiV1AuthAccountPost(
  body: API.UserLogin,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelToken_>('/api/v1/auth/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取用户信息 获取当前登录用户的详细信息、角色和权限 GET /api/v1/auth/info */
export async function getUserInfoApiV1AuthInfoGet(options?: { [key: string]: any }) {
  return request<API.ResponseModelUserInfo_>('/api/v1/auth/info', {
    method: 'GET',
    ...(options || {}),
  })
}

/** OAuth2标准登录 使用OAuth2标准方式登录系统，获取访问令牌 POST /api/v1/auth/login */
export async function loginAccessTokenApiV1AuthLoginPost(
  body: API.BodyLoginAccessTokenApiV1AuthLoginPost,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelToken_>('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: body,
    ...(options || {}),
  })
}
