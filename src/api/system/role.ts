import request from '@/utils/request';

// 获取角色列表
export function getRoleList(query: any) {
  return request({
    url: '/system/roles',
    method: 'get',
    params: query
  });
}

// 获取角色详情
export function getRole(roleId: number) {
  return request({
    url: `/system/roles/${roleId}`,
    method: 'get'
  });
}

// 新增角色
export function addRole(data: any) {
  return request({
    url: '/system/roles',
    method: 'post',
    data
  });
}

// 修改角色
export function updateRole(data: any) {
  return request({
    url: `/system/roles/${data.roleId}`,
    method: 'put',
    data
  });
}

// 删除角色
export function deleteRole(roleId: number) {
  return request({
    url: `/system/roles/${roleId}`,
    method: 'delete'
  });
}

// 修改角色状态
export function changeRoleStatus(roleId: number, status: string) {
  return request({
    url: `/system/roles/${roleId}/status/${status}`,
    method: 'put'
  });
}

// 获取角色选择框列表
export function getRoleOptions() {
  return request({
    url: '/system/roles/options',
    method: 'get'
  });
}
