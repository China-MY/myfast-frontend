// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建参数配置 创建新参数配置 POST /api/v1/system/config */
export async function createConfigApiV1SystemConfigPost(
  body: API.ConfigCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelConfigOut_>('/api/v1/system/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取参数配置详情 根据参数ID获取参数配置详情 GET /api/v1/system/config/${param0} */
export async function getConfigApiV1SystemConfigConfigIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConfigApiV1SystemConfigConfigIdGetParams,
  options?: { [key: string]: any }
) {
  const { config_id: param0, ...queryParams } = params
  return request<API.ResponseModelConfigOut_>(`/api/v1/system/config/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新参数配置 更新参数配置信息 PUT /api/v1/system/config/${param0} */
export async function updateConfigApiV1SystemConfigConfigIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateConfigApiV1SystemConfigConfigIdPutParams,
  body: API.ConfigUpdate,
  options?: { [key: string]: any }
) {
  const { config_id: param0, ...queryParams } = params
  return request<API.ResponseModelConfigOut_>(`/api/v1/system/config/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除参数配置 删除指定参数配置 DELETE /api/v1/system/config/${param0} */
export async function deleteConfigApiV1SystemConfigConfigIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteConfigApiV1SystemConfigConfigIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { config_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/config/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 根据参数键名获取参数值 根据参数键名获取参数值 GET /api/v1/system/config/key/${param0} */
export async function getConfigByKeyApiV1SystemConfigKeyConfigKeyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConfigByKeyApiV1SystemConfigKeyConfigKeyGetParams,
  options?: { [key: string]: any }
) {
  const { config_key: param0, ...queryParams } = params
  return request<API.ResponseModelStr_>(`/api/v1/system/config/key/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取参数配置列表 分页获取参数配置列表 GET /api/v1/system/config/list */
export async function listConfigsApiV1SystemConfigListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listConfigsApiV1SystemConfigListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModelListConfigOut_>('/api/v1/system/config/list', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',
      ...params,
    },
    ...(options || {}),
  })
}
