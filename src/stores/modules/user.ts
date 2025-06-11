import { defineStore } from 'pinia'
import { getUserInfoApiV1AuthInfoGet, logoutApiV1AuthPost } from '@/api/renzheng'
import { setToken, removeToken } from '@/utils/auth'
import type { UserInfo } from '@/types/user'
import { ElMessage } from 'element-plus'

// 后端返回的用户信息数据结构
interface ServerUserInfo {
  user: any;
  roles: string[];
  permissions: string[];
}

// 缓存用户信息的全局变量，避免频繁请求
let userInfoCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 缓存有效期1分钟
let pollingEnabled = true; // 控制轮询状态

// 添加轮询控制事件监听
document.addEventListener('stop-auth-polling', () => {
  console.log('接收到停止auth轮询的信号');
  pollingEnabled = false;
});

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: {} as any,
    permissions: [] as string[],
    roles: [] as string[],
    isLogin: false,
    routesAdded: false, // 添加路由状态标记
  }),
  getters: {
    isAdmin(): boolean {
      return this.roles.includes('admin')
    },
    hasPermission: (state) => (permission: string | string[]) => {
      if (state.roles.includes('admin')) {
        return true
      }

      if (typeof permission === 'string') {
        return state.permissions.includes(permission)
      }

      if (Array.isArray(permission)) {
        return permission.some(p => state.permissions.includes(p))
      }

      return false
    }
  },
  actions: {
    // 登录 - 此方法已通过直接调用API处理
    async login(username: string, password: string) {
      // 现在在登录页中直接使用API调用进行登录
      return false
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        // 如果已禁用轮询且缓存存在，直接返回缓存
        const now = Date.now();
        if (!pollingEnabled && userInfoCache && (now - lastFetchTime < CACHE_DURATION)) {
          console.log('使用缓存的用户信息，避免频繁请求');
          // 保持状态一致性
          this.userInfo = userInfoCache.user || {};
          this.permissions = userInfoCache.permissions || [];
          this.roles = userInfoCache.roles || [];
          this.isLogin = true;
          return userInfoCache;
        }

        console.log('获取用户信息...')
        // 调用获取用户信息API
        const response = await getUserInfoApiV1AuthInfoGet() as any

        // 请求成功，解构数据
        if (response && response.code === 200 && response.data) {
          const { user = {}, roles = [], permissions = [] } = response.data

          // 更新缓存
          userInfoCache = { user, roles, permissions };
          lastFetchTime = now;

          this.userInfo = user
          this.permissions = permissions
          this.roles = roles
          this.isLogin = true

          return { user, roles, permissions }
        } else {
          console.warn('获取用户信息响应异常:', response)

          // 开发环境使用默认权限（生产环境应该移除）
          if (import.meta.env.DEV) {
            console.warn('开发环境：使用默认admin权限继续')
            const defaultInfo = {
              user: { username: 'admin', nickname: '管理员' },
              roles: ['admin'],
              permissions: ['*:*:*']
            };
            // 更新缓存
            userInfoCache = defaultInfo;
            lastFetchTime = now;

            this.userInfo = defaultInfo.user;
            this.roles = defaultInfo.roles;
            this.permissions = defaultInfo.permissions;
            this.isLogin = true;
            return defaultInfo;
          }

          throw new Error(response?.msg || '获取用户信息失败')
        }
      } catch (error) {
        console.error('获取用户信息出错:', error)

        // 开发环境使用默认权限（生产环境应该移除）
        if (import.meta.env.DEV) {
          console.warn('开发环境：使用默认admin权限继续')
          const defaultInfo = {
            user: { username: 'admin', nickname: '管理员' },
            roles: ['admin'],
            permissions: ['*:*:*']
          };
          // 更新缓存
          userInfoCache = defaultInfo;
          lastFetchTime = Date.now();

          this.userInfo = defaultInfo.user;
          this.roles = defaultInfo.roles;
          this.permissions = defaultInfo.permissions;
          this.isLogin = true;
          return defaultInfo;
        }

        throw error
      }
    },

    // 登出
    async logout() {
      try {
        console.log('开始执行登出操作...')
        // 调用注销API
        await logoutApiV1AuthPost()
        ElMessage.success('已成功退出登录')
      } catch (error) {
        console.error('登出请求失败', error)
        ElMessage.error('注销失败，但已清除本地登录状态')
      } finally {
        this.resetUserState()
      }
    },

    // 重置用户状态
    resetUserState() {
      console.log('重置用户状态...')
      this.userInfo = {}
      this.permissions = []
      this.roles = []
      this.isLogin = false
      this.routesAdded = false // 重置路由添加状态
      // 清除缓存
      userInfoCache = null;
      lastFetchTime = 0;
      removeToken()
    }
  }
})
