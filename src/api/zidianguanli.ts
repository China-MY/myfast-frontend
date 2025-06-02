// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加字典数据 添加字典数据 POST /api/system/dict/data/add */
export async function addDictDataApiSystemDictDataAddPost(
  body: API.DictDataCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/data/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改字典数据 修改字典数据 PUT /api/system/dict/data/edit */
export async function editDictDataApiSystemDictDataEditPut(
  body: API.DictDataUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/data/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取字典数据详情 获取字典数据详情 GET /api/system/dict/data/info/${param0} */
export async function getDictDataInfoApiSystemDictDataInfoDictCodeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataInfoApiSystemDictDataInfoDictCodeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/data/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取字典数据列表 获取字典数据列表（分页查询） GET /api/system/dict/data/list */
export async function getDictDataListApiSystemDictDataListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataListApiSystemDictDataListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/data/list', {
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

/** 删除字典数据 删除字典数据 DELETE /api/system/dict/data/remove/${param0} */
export async function removeDictDataApiSystemDictDataRemoveDictCodeDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeDictDataApiSystemDictDataRemoveDictCodeDeleteParams,
  options?: { [key: string]: any }
) {
  const { dict_code: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/data/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 根据字典类型获取字典数据 根据字典类型获取字典数据 GET /api/system/dict/data/type/${param0} */
export async function getDictDataByTypeApiSystemDictDataTypeDictTypeGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictDataByTypeApiSystemDictDataTypeDictTypeGetParams,
  options?: { [key: string]: any }
) {
  const { dict_type: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/data/type/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 添加字典类型 添加字典类型 POST /api/system/dict/type/add */
export async function addDictTypeApiSystemDictTypeAddPost(
  body: API.DictTypeCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/type/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改字典类型 修改字典类型 PUT /api/system/dict/type/edit */
export async function editDictTypeApiSystemDictTypeEditPut(
  body: API.DictTypeUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/type/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取字典类型详情 获取字典类型详情 GET /api/system/dict/type/info/${param0} */
export async function getDictTypeInfoApiSystemDictTypeInfoDictIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictTypeInfoApiSystemDictTypeInfoDictIdGetParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/type/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取字典类型列表 获取字典类型列表（分页查询） GET /api/system/dict/type/list */
export async function getDictTypeListApiSystemDictTypeListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictTypeListApiSystemDictTypeListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dict/type/list', {
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

/** 删除字典类型 删除字典类型 DELETE /api/system/dict/type/remove/${param0} */
export async function removeDictTypeApiSystemDictTypeRemoveDictIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeDictTypeApiSystemDictTypeRemoveDictIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { dict_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dict/type/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}
