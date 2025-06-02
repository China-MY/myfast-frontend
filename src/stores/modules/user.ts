import { defineStore } from 'pinia'
import { request } from '@/utils/request'
import { setToken, removeToken } from '@/utils/auth'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: {} as UserInfo,
    permissions: [] as string[],
    roles: [] as string[],
    isLogin: false,
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
    // 登录
    async login(username: string, password: string) {
      try {
        const res = await request.post('/api/auth/login', { username, password })
        if (res && res.data && res.data.token) {
          setToken(res.data.token)
          this.isLogin = true
          return this.getUserInfo()
        }
        return false
      } catch (error) {
        return false
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await request.get('/api/user/info')
        if (res && res.data) {
          this.userInfo = res.data
          this.permissions = res.data.permissions || []
          this.roles = res.data.roles || []
          this.isLogin = true
          return res.data
        }
        return null
      } catch (error) {
        return null
      }
    },
    
    // 登出
    async logout() {
      try {
        await request.post('/api/auth/logout')
      } catch (error) {
        console.error('登出请求失败', error)
      } finally {
        this.resetUserState()
      }
    },
    
    // 重置用户状态
    resetUserState() {
      this.userInfo = {} as UserInfo
      this.permissions = []
      this.roles = []
      this.isLogin = false
      removeToken()
    }
  }
}) 