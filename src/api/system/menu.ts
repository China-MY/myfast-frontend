import request from '@/utils/request';

// 获取菜单列表
export function getMenuList(query?: any) {
  return request({
    url: '/system/menus',
    method: 'get',
    params: query
  });
}

// 获取菜单详情
export function getMenu(menuId: number) {
  return request({
    url: `/system/menus/${menuId}`,
    method: 'get'
  });
}

// 新增菜单
export function addMenu(data: any) {
  return request({
    url: '/system/menus',
    method: 'post',
    data
  });
}

// 修改菜单
export function updateMenu(data: any) {
  return request({
    url: `/system/menus/${data.menuId}`,
    method: 'put',
    data
  });
}

// 删除菜单
export function deleteMenu(menuId: number) {
  return request({
    url: `/system/menus/${menuId}`,
    method: 'delete'
  });
}

// 获取菜单树形选择器数据
export function getMenuTreeselect() {
  return request({
    url: '/system/menus/options',
    method: 'get'
  });
}

// 获取菜单树结构
export function getMenuTree() {
  return request({
    url: '/system/menus/tree',
    method: 'get'
  });
}

// 获取角色菜单树
export function getRoleMenuTree(roleId: number) {
  return request({
    url: `/system/roles/${roleId}/menu-tree`,
    method: 'get'
  });
}
