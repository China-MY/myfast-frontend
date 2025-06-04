import { defineStore } from 'pinia'
import { getUserInfoApiV1AuthInfoGet } from '@/api/renzheng'
import { setToken, removeToken } from '@/utils/auth'
import type { UserInfo } from '@/types/user'
import { message } from 'ant-design-vue'

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
    // 登录 - 此方法已通过直接调用API处理
    async login(username: string, password: string) {
      // 现在在登录页中直接使用API调用进行登录
      return false
    },
    
    // 获取用户信息
    async getUserInfo() {
      try {
        const response = await getUserInfoApiV1AuthInfoGet()
        
        // response现在是从request.ts返回的处理后的数据，不是axios响应对象
        if (response && response.code === 200 && response.data) {
          const userInfo = response.data
          this.userInfo = userInfo.user
          this.permissions = userInfo.permissions || []
          this.roles = userInfo.roles || []
          this.isLogin = true
          return userInfo
        } else {
          message.error(response?.msg || '获取用户信息失败')
          return null
        }
      } catch (error: any) {
        console.error('获取用户信息失败:', error)
        
        // 可能的特定错误处理
        if (error.response?.status === 401) {
          // 401错误在request.ts中已处理，这里不需要额外处理
          message.error('登录状态已过期，请重新登录')
          this.resetUserState()
        } else {
          message.error(error.message || '获取用户信息失败，请重新登录')
        }
        
        return null
      }
    },
    
    // 登出
    async logout() {
      try {
        // 可以添加调用登出API的代码
        // await logoutApiV1AuthLogoutPost()
        message.success('已成功退出登录')
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