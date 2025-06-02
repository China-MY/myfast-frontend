import request from '@/utils/request';

// 获取表单配置列表
export function getFormList(params: {
  form_name?: string;
  page_num: number;
  page_size: number;
}) {
  return request({
    url: '/api/v1/tool/form/list',
    method: 'get',
    params
  });
}

// 获取表单配置详情
export function getFormInfo(formId: number) {
  return request({
    url: `/api/v1/tool/form/info/${formId}`,
    method: 'get'
  });
}

// 添加表单配置
export function addForm(data: {
  form_name: string;
  form_content: string;
  remark?: string;
}) {
  return request({
    url: '/api/v1/tool/form/add',
    method: 'post',
    data
  });
}

// 修改表单配置
export function updateForm(data: {
  form_id: number;
  form_name: string;
  form_content: string;
  remark?: string;
}) {
  return request({
    url: '/api/v1/tool/form/edit',
    method: 'put',
    data
  });
}

// 删除表单配置
export function deleteForm(formId: number) {
  return request({
    url: `/api/v1/tool/form/remove/${formId}`,
    method: 'delete'
  });
}
