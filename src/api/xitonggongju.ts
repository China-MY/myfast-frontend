// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取表单设计器组件 获取表单设计器组件 GET /api/tool/form/designer */
export async function getFormDesignerApiToolFormDesignerGet(options?: { [key: string]: any }) {
  return request<any>('/api/tool/form/designer', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 渲染表单 根据表单ID渲染表单 GET /api/tool/form/render/${param0} */
export async function renderFormApiToolFormRenderFormIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.renderFormApiToolFormRenderFormIdGetParams,
  options?: { [key: string]: any }
) {
  const { form_id: param0, ...queryParams } = params
  return request<any>(`/api/tool/form/render/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 保存表单配置 保存表单配置 POST /api/tool/form/save */
export async function saveFormConfigApiToolFormSavePost(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<any>('/api/tool/form/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取表单模板 获取表单模板列表 GET /api/tool/form/template */
export async function getFormTemplateApiToolFormTemplateGet(options?: { [key: string]: any }) {
  return request<any>('/api/tool/form/template', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取Swagger JSON 获取Swagger JSON数据 GET /api/tool/swagger/json */
export async function getSwaggerJsonApiToolSwaggerJsonGet(options?: { [key: string]: any }) {
  return request<any>('/api/tool/swagger/json', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Swagger UI页面 返回Swagger UI页面 GET /api/tool/swagger/ui */
export async function getSwaggerUiApiToolSwaggerUiGet(options?: { [key: string]: any }) {
  return request<any>('/api/tool/swagger/ui', {
    method: 'GET',
    ...(options || {}),
  })
}
