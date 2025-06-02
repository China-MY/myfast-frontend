import request from '@/utils/request';

// 查询岗位列表
export function listPost(query: any) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  });
}

// 查询岗位详细
export function getPost(postId: number) {
  return request({
    url: `/system/post/info/${postId}`,
    method: 'get'
  });
}

// 新增岗位
export function addPost(data: any) {
  return request({
    url: '/system/post/add',
    method: 'post',
    data: data
  });
}

// 修改岗位
export function updatePost(data: any) {
  return request({
    url: '/system/post/edit',
    method: 'put',
    data: data
  });
}

// 删除岗位
export function delPost(postId: number | number[]) {
  return request({
    url: `/system/post/remove/${postId}`,
    method: 'delete'
  });
}

// 导出岗位
export function exportPost(query: any) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  });
}
