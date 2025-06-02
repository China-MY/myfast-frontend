// 用户信息接口
export interface UserInfo {
  id: number | string;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status?: number;
  deptId?: number;
  roles?: string[];
  permissions?: string[];
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 登录参数接口
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}

// 登录结果接口
export interface LoginResult {
  token: string;
}

// 分页参数
export interface PageParams {
  page: number;
  pageSize: number;
  [key: string]: any;
}

// 分页结果
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
} 