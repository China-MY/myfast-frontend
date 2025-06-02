import request from '@/utils/request';

// 获取代码生成表列表
export function getGenTableList(params: {
  table_name?: string;
  table_comment?: string;
  begin_time?: string;
  end_time?: string;
  page_num: number;
  page_size: number;
}) {
  return request({
    url: '/api/v1/tool/gen/list',
    method: 'get',
    params
  });
}

// 查询表详细信息
export function getGenTableInfo(tableId: number) {
  return request({
    url: `/api/v1/tool/gen/info/${tableId}`,
    method: 'get'
  });
}

// 获取数据库表列表
export function getDbTableList(params: {
  table_name?: string;
  table_comment?: string;
}) {
  return request({
    url: '/api/v1/tool/gen/db/list',
    method: 'get',
    params
  });
}

// 导入表
export function importTable(tables: string[]) {
  return request({
    url: '/api/v1/tool/gen/import',
    method: 'post',
    data: { tables }
  });
}

// 修改代码生成信息
export function updateGenTable(data: any) {
  return request({
    url: '/api/v1/tool/gen/edit',
    method: 'put',
    data
  });
}

// 删除代码生成表
export function deleteGenTable(tableIds: number[]) {
  return request({
    url: `/api/v1/tool/gen/remove/${tableIds.join(',')}`,
    method: 'delete'
  });
}

// 预览代码
export function previewCode(tableId: number) {
  return request({
    url: `/api/v1/tool/gen/preview/${tableId}`,
    method: 'get'
  });
}

// 下载代码
export function downloadCode(tableId: number) {
  return request({
    url: `/api/v1/tool/gen/download/${tableId}`,
    method: 'get',
    responseType: 'blob'
  });
}
