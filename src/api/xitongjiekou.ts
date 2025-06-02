// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取Swagger JSON 获取Swagger JSON数据 GET /api/tool/swagger/json */
export async function getSwaggerJsonApiToolSwaggerJsonGet(options?: { [key: string]: any }) {
  return request<any>('/api/tool/swagger/json', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Swagger UI页面 返回Swagger UI页面 GET /api/tool/swagger/ui */
export async function getSwaggerUiApiToolSwaggerUiGet(options?: { [key: string]: any }) {
  return request<any>('/api/tool/swagger/ui', {
    method: 'GET',
    ...(options || {}),
  })
}
