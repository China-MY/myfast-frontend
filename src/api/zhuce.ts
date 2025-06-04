// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Register User 注册新用户 POST /api/v1/auth/register */
export async function registerUserApiV1AuthRegisterPost(
  body: API.UserCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelUser_>('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
