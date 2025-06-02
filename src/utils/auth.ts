// Token存储的键名
const TOKEN_KEY = 'myfast_token';

/**
 * 获取存储的Token
 */
export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

/**
 * 设置Token到本地存储
 * @param token Token字符串
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 从本地存储中移除Token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
