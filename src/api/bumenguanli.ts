// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加部门 添加部门 POST /api/system/dept/add */
export async function addDeptApiSystemDeptAddPost(
  body: API.DeptCreate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dept/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改部门 修改部门 PUT /api/system/dept/edit */
export async function editDeptApiSystemDeptEditPut(
  body: API.DeptUpdate,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dept/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取部门详情 获取部门详情 GET /api/system/dept/info/${param0} */
export async function getDeptInfoApiSystemDeptInfoDeptIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeptInfoApiSystemDeptInfoDeptIdGetParams,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dept/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取部门列表 获取部门列表 GET /api/system/dept/list */
export async function getDeptListApiSystemDeptListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeptListApiSystemDeptListGetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/system/dept/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 删除部门 删除部门 DELETE /api/system/dept/remove/${param0} */
export async function removeDeptApiSystemDeptRemoveDeptIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeDeptApiSystemDeptRemoveDeptIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { dept_id: param0, ...queryParams } = params
  return request<any>(`/api/system/dept/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取部门树选择数据 获取部门树选择数据 GET /api/system/dept/treeselect */
export async function getDeptTreeSelectApiSystemDeptTreeselectGet(options?: {
  [key: string]: any
}) {
  return request<any>('/api/system/dept/treeselect', {
    method: 'GET',
    ...(options || {}),
  })
}
