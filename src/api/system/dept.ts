import request from '@/utils/request';

// 查询部门列表
export function listDept(query: any) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  });
}

// 查询部门详细
export function getDept(deptId: number) {
  return request({
    url: `/system/dept/info/${deptId}`,
    method: 'get'
  });
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId: number) {
  return request({
    url: `/system/dept/roleDeptTreeselect/${roleId}`,
    method: 'get'
  });
}

// 新增部门
export function addDept(data: any) {
  return request({
    url: '/system/dept/add',
    method: 'post',
    data: data
  });
}

// 修改部门
export function updateDept(data: any) {
  return request({
    url: '/system/dept/edit',
    method: 'put',
    data: data
  });
}

// 删除部门
export function delDept(deptId: number) {
  return request({
    url: `/system/dept/remove/${deptId}`,
    method: 'delete'
  });
}

// 获取部门树形选择器数据
export function getDeptTreeselect() {
  return request({
    url: '/system/depts/options',
    method: 'get'
  });
}

// 获取部门树结构
export function getDeptTree() {
  return request({
    url: '/system/depts/tree',
    method: 'get'
  });
}

// 获取角色部门树
export function getRoleDeptTree(roleId: number) {
  return request({
    url: `/system/roles/${roleId}/dept-tree`,
    method: 'get'
  });
}
