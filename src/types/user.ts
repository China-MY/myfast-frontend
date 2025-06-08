// 用户信息接口
export interface UserInfo {
  user: User;
  roles: string[];
  permissions: string[];
}

// 用户接口
export interface User {
  user_id: number;
  username: string;
  nickname: string;
  email?: string;
  phonenumber?: string;
  sex?: string;
  status?: string;
  dept_id?: number;
  create_time: string;
  update_time?: string;
  roles?: Role[];
  dept?: Dept;
}

// 角色接口
export interface Role {
  role_id: number;
  role_name: string;
  role_key: string;
}

// 部门接口
export interface Dept {
  dept_id: number;
  dept_name: string;
}

// 分页信息
export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
}

// API响应基础接口
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

// 带分页的API响应接口
export interface PageResponse<T = any> extends ApiResponse {
  rows: T[];
  pageInfo: PageInfo;
} 