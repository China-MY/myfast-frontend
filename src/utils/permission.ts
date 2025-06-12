import type { App } from 'vue'
import { useUserStore } from '@/stores/modules/user'

/**
 * 权限指令
 * 用法：
 * 1. 单个权限：v-permission="'system:user:add'"
 * 2. 多个权限（满足一个即可）：v-permission="['system:user:add', 'system:user:edit']"
 */
export function setupPermissionDirective(app: App) {
  app.directive('permission', {
    mounted(el, binding) {
      const userStore = useUserStore()
      const { value } = binding
      
      // 如果未传递值，不做处理
      if (!value) {
        return
      }
      
      // 检查是否有权限
      const hasPermission = userStore.hasPermission(value)
      
      if (!hasPermission) {
        // 如果没有权限，则移除元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  })

  // 添加hasPermi指令，与permission指令功能相同
  app.directive('hasPermi', {
    mounted(el, binding) {
      const userStore = useUserStore()
      const { value } = binding
      
      // 如果未传递值，不做处理
      if (!value) {
        return
      }
      
      // 检查是否有权限
      const hasPermission = userStore.hasPermission(value)
      
      if (!hasPermission) {
        // 如果没有权限，则移除元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  })
} 