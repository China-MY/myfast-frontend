// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 用户登录 用户登录接口 POST /api/auth/login */
export async function loginApiAuthLoginPost(
  body: API.BodyLoginApiAuthLoginPost,
  options?: { [key: string]: any }
) {
  return request<API.LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: body,
    ...(options || {}),
  })
}
