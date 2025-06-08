// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建岗位 创建新岗位 POST /api/v1/system/post */
export async function createPostApiV1SystemPostPost(
  body: API.PostCreate,
  options?: { [key: string]: any }
) {
  return request<API.ResponseModelPostOut_>('/api/v1/system/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取岗位详情 根据岗位ID获取岗位详情 GET /api/v1/system/post/${param0} */
export async function getPostApiV1SystemPostPostIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostApiV1SystemPostPostIdGetParams,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<API.ResponseModelPostOut_>(`/api/v1/system/post/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新岗位 更新岗位信息 PUT /api/v1/system/post/${param0} */
export async function updatePostApiV1SystemPostPostIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePostApiV1SystemPostPostIdPutParams,
  body: API.PostUpdate,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<API.ResponseModelPostOut_>(`/api/v1/system/post/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除岗位 删除指定岗位 DELETE /api/v1/system/post/${param0} */
export async function deletePostApiV1SystemPostPostIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePostApiV1SystemPostPostIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<API.ResponseModel>(`/api/v1/system/post/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取岗位列表 分页获取岗位列表 GET /api/v1/system/post/list */
export async function listPostsApiV1SystemPostListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listPostsApiV1SystemPostListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PageResponseModelListPostOut_>('/api/v1/system/post/list', {
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

/** 获取岗位选项 获取岗位选项列表 GET /api/v1/system/post/select/options */
export async function getPostOptionsApiV1SystemPostSelectOptionsGet(options?: {
  [key: string]: any
}) {
  return request<API.ResponseModelListPostOut_>('/api/v1/system/post/select/options', {
    method: 'GET',
    ...(options || {}),
  })
}
