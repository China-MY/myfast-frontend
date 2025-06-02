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
