// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建字典数据 创建新字典数据 POST /api/v1/system/dict/data */
export async function createDictDataApiV1SystemDictDataPost(
  body: API.DictDataCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelDictDataOut_>('/api/v1/system/dict/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取字典数据详情 根据字典编码获取字典数据详情 GET /api/v1/system/dict/data/${param0} */
export async function getDictDataApiV1SystemDictDataDictCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataApiV1SystemDictDataDictCodeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<API.ResponseModelDictDataOut_>(`/api/v1/system/dict/data/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新字典数据 更新字典数据信息 PUT /api/v1/system/dict/data/${param0} */
export async function updateDictDataApiV1SystemDictDataDictCodePut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDictDataApiV1SystemDictDataDictCodePutParams,
  body: API.DictDataUpdate,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<API.ResponseModelDictDataOut_>(`/api/v1/system/dict/data/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除字典数据 删除指定字典数据 DELETE /api/v1/system/dict/data/${param0} */
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

/** 获取字典数据列表 分页获取字典数据列表 GET /api/v1/system/dict/data/list */
export async function listDictDataApiV1SystemDictDataListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listDictDataApiV1SystemDictDataListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModelListDictDataOut_>('/api/v1/system/dict/data/list', {
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

/** 根据字典类型获取字典数据 根据字典类型获取字典数据列表 GET /api/v1/system/dict/data/type/${param0} */
export async function getDictDataByTypeApiV1SystemDictDataTypeDictTypeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataByTypeApiV1SystemDictDataTypeDictTypeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_type: param0, ...queryParams } = params
  return request<API.ResponseModelListDictDataOut_>(`/api/v1/system/dict/data/type/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 创建字典类型 创建新字典类型 POST /api/v1/system/dict/type */
export async function createDictTypeApiV1SystemDictTypePost(
  body: API.DictTypeCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelDictTypeOut_>('/api/v1/system/dict/type', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取字典类型详情 根据字典类型ID获取详情 GET /api/v1/system/dict/type/${param0} */
export async function getDictTypeApiV1SystemDictTypeDictIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictTypeApiV1SystemDictTypeDictIdGetParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<API.ResponseModelDictTypeOut_>(`/api/v1/system/dict/type/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新字典类型 更新字典类型信息 PUT /api/v1/system/dict/type/${param0} */
export async function updateDictTypeApiV1SystemDictTypeDictIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDictTypeApiV1SystemDictTypeDictIdPutParams,
  body: API.DictTypeUpdate,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<API.ResponseModelDictTypeOut_>(`/api/v1/system/dict/type/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除字典类型 删除指定字典类型 DELETE /api/v1/system/dict/type/${param0} */
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

/** 获取字典类型列表 分页获取字典类型列表 GET /api/v1/system/dict/type/list */
export async function listDictTypesApiV1SystemDictTypeListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listDictTypesApiV1SystemDictTypeListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModelListDictTypeOut_>('/api/v1/system/dict/type/list', {
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

/** 获取字典类型选项 获取字典类型选项列表 GET /api/v1/system/dict/type/options */
export async function getDictTypeOptionsApiV1SystemDictTypeOptionsGet(options?: {
  [key: string]: any
}) {
  return request<API.ResponseModelListDictTypeOut_>('/api/v1/system/dict/type/options', {
    method: 'GET',
    ...(options || {}),
  })
}
