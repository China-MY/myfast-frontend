import type { DirectiveBinding } from 'vue';
import { useUserStore } from '@/stores/modules/user';

/**
 * 按钮权限指令
 * v-permission="['system:user:add']" - 权限验证
 * v-permission="{permission: ['system:user:add'], role: ['admin']}" - 权限和角色验证
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const userStore = useUserStore();
    
    // 超级管理员直接放行
    if (userStore.isAdmin) {
      return;
    }

    // 判断权限
    if (typeof value === 'object' && value !== null) {
      // 新格式: {permission: [], role: []}
      if ('permission' in value || 'role' in value) {
        const { permission, role } = value as { permission?: string[], role?: string[] };
        
        // 验证权限
        let hasPermission = true;
        if (permission && permission.length > 0) {
          hasPermission = userStore.permissions.some((p: string) => permission.includes(p));
        }
        
        // 验证角色
        let hasRole = true;
        if (role && role.length > 0) {
          hasRole = userStore.roles.some((r: string) => role.includes(r));
        }
        
        if (!hasPermission && !hasRole) {
          el.parentNode && el.parentNode.removeChild(el);
        }
        return;
      }
    }
    
    // 旧格式: ['system:user:add']
    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = userStore.permissions.some((permission: string) => {
        return value.includes(permission);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('使用方式：v-permission="[\'system:user:add\']" 或 v-permission="{permission: [\'system:user:add\'], role: [\'admin\']}"');
    }
  }
};
