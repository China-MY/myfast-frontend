import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, getUserInfo as getUserInfoApi, logout as logoutApi } from '@/api/auth';
import { setToken, removeToken } from '@/utils/auth';

interface LoginData {
  username: string;
  password: string;
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('');
  const username = ref<string>('');
  const nickname = ref<string>('');
  const avatar = ref<string>('');
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);

  // 登录
  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      // 直接模拟登录成功
      if (loginData.username === 'admin' && loginData.password === 'admin123') {
        // 生成模拟token
        const mockToken = 'mock_token_' + Math.random().toString(36).substring(2);
        setToken(mockToken);
        token.value = mockToken;
        return true;
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 获取用户信息
  const getUserInfo = async (): Promise<boolean> => {
    try {
      // 直接返回模拟用户信息
      if (token.value && token.value.startsWith('mock_token_')) {
        const userInfo = {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          email: 'admin@example.com',
          avatar: '',
          roles: ['admin'],
          permissions: ['*:*:*']
        };

        username.value = userInfo.username;
        nickname.value = userInfo.nickname;
        avatar.value = userInfo.avatar || '';
        roles.value = userInfo.roles;
        permissions.value = userInfo.permissions;

        return true;
      }

      // 真实情况下调用后端接口
      try {
        const res = await getUserInfoApi();
        // 根据实际API返回结构解析
        if (res && typeof res === 'object' && 'data' in res) {
          const responseData = res.data;
          if (responseData && typeof responseData === 'object' && 'user' in responseData) {
            const { user, roles: roleKeys, permissions: permissionKeys } = responseData;
            username.value = user.username;
            nickname.value = user.nickname;
            avatar.value = user.avatar || '';
            roles.value = roleKeys || [];
            permissions.value = permissionKeys || [];
            return true;
          }
        }
        throw new Error('获取用户信息失败: 返回格式错误');
      } catch (apiError) {
        console.error('API请求失败:', apiError);
        throw new Error('获取用户信息失败');
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 登出
  const logout = async (): Promise<boolean> => {
    try {
      // 清理本地token
      resetState();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 重置状态
  const resetState = (): void => {
    token.value = '';
    username.value = '';
    nickname.value = '';
    avatar.value = '';
    roles.value = [];
    permissions.value = [];
    removeToken();
  };

  // 判断是否有权限
  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes(permission);
  };

  // 判断是否有角色
  const hasRole = (role: string): boolean => {
    return roles.value.includes(role);
  };

  return {
    token,
    username,
    nickname,
    avatar,
    roles,
    permissions,
    login,
    getUserInfo,
    logout,
    resetState,
    hasPermission,
    hasRole
  };
});
