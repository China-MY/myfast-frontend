// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加岗位 添加岗位 POST /api/system/post/add */
export async function addPostApiSystemPostAddPost(
  body: API.PostCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改岗位 修改岗位 PUT /api/system/post/edit */
export async function editPostApiSystemPostEditPut(
  body: API.PostUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/post/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取岗位详情 获取岗位详情 GET /api/system/post/info/${param0} */
export async function getPostInfoApiSystemPostInfoPostIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostInfoApiSystemPostInfoPostIdGetParams,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<any>(`/api/system/post/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取岗位列表 获取岗位列表（分页查询） GET /api/system/post/list */
export async function getPostListApiSystemPostListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostListApiSystemPostListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/post/list', {
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

/** 删除岗位 删除岗位 DELETE /api/system/post/remove/${param0} */
export async function removePostApiSystemPostRemovePostIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removePostApiSystemPostRemovePostIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { post_id: param0, ...queryParams } = params
  return request<any>(`/api/system/post/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}
