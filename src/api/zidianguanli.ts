// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** Create Dict Data 创建字典数据 POST /api/v1/system/dict/data */
export async function createDictDataApiV1SystemDictDataPost(
  body: API.DictDataCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModel>('/api/v1/system/dict/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Dict Data 根据编码获取字典数据 GET /api/v1/system/dict/data/${param0} */
export async function getDictDataApiV1SystemDictDataDictCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataApiV1SystemDictDataDictCodeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/data/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Dict Data 更新字典数据 PUT /api/v1/system/dict/data/${param0} */
export async function updateDictDataApiV1SystemDictDataDictCodePut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDictDataApiV1SystemDictDataDictCodePutParams,
  body: API.DictDataUpdate,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/data/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete Dict Data 删除字典数据 DELETE /api/v1/system/dict/data/${param0} */
export async function deleteDictDataApiV1SystemDictDataDictCodeDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDictDataApiV1SystemDictDataDictCodeDeleteParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/data/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** List Dict Data 获取字典数据列表(带分页) GET /api/v1/system/dict/data/list */
export async function listDictDataApiV1SystemDictDataListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listDictDataApiV1SystemDictDataListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModel>('/api/v1/system/dict/data/list', {
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

/** Get Dict Data Options 根据字典类型获取选项列表，用于前端下拉选择 GET /api/v1/system/dict/data/options/${param0} */
export async function getDictDataOptionsApiV1SystemDictDataOptionsDictTypeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataOptionsApiV1SystemDictDataOptionsDictTypeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_type: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/data/options/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Get Dict Data By Type 根据字典类型获取字典数据列表 GET /api/v1/system/dict/data/type/${param0} */
export async function getDictDataByTypeApiV1SystemDictDataTypeDictTypeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataByTypeApiV1SystemDictDataTypeDictTypeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_type: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/data/type/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Create Dict Type 创建字典类型 POST /api/v1/system/dict/type */
export async function createDictTypeApiV1SystemDictTypePost(
  body: API.DictTypeCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModel>('/api/v1/system/dict/type', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Dict Type 根据ID获取字典类型详情 GET /api/v1/system/dict/type/${param0} */
export async function getDictTypeApiV1SystemDictTypeDictIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictTypeApiV1SystemDictTypeDictIdGetParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/type/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Dict Type 更新字典类型 PUT /api/v1/system/dict/type/${param0} */
export async function updateDictTypeApiV1SystemDictTypeDictIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDictTypeApiV1SystemDictTypeDictIdPutParams,
  body: API.DictTypeUpdate,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/type/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete Dict Type 删除字典类型 DELETE /api/v1/system/dict/type/${param0} */
export async function deleteDictTypeApiV1SystemDictTypeDictIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDictTypeApiV1SystemDictTypeDictIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/dict/type/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Get All Enabled Dict Types 获取所有启用状态的字典类型列表 GET /api/v1/system/dict/type/all */
export async function getAllEnabledDictTypesApiV1SystemDictTypeAllGet(options?: {
  [key: string]: any
}) {
  return request<API.ResponseModel>('/api/v1/system/dict/type/all', {
    method: 'GET',
    ...(options || {}),
  })
}

/** List Dict Types 获取字典类型列表(带分页) GET /api/v1/system/dict/type/list */
export async function listDictTypesApiV1SystemDictTypeListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listDictTypesApiV1SystemDictTypeListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModel>('/api/v1/system/dict/type/list', {
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
