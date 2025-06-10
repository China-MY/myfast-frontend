/**
 * 视图组件检查工具
 * 用于确保所有路由组件都能被正确加载
 */

import { routeLog } from './routeLog';

// 需要检查的组件路径列表
const componentsToCheck = [
  'monitor/server/index.vue',
  'monitor/server/index/index.vue',
  'monitor/online/index.vue',
  'monitor/job/index.vue',
  'monitor/data/index.vue',
  'monitor/cache/index.vue',
  'monitor/druid/index.vue',
  'system/user/index.vue',
  'system/role/index.vue',
  'system/menu/index.vue',
  'system/dict/index.vue',
  'system/config/index.vue',
  'tool/gen/index.vue',
  'tool/swagger/index.vue',
  'tool/build/index.vue'
];

/**
 * 检查组件路径是否可导入
 */
export async function checkComponents() {
  routeLog('important', '开始检查组件路径...');
  
  // 检查每个组件
  for (const comp of componentsToCheck) {
    try {
      const fullPath = `@/views/${comp}`;
      routeLog('info', `检查组件: ${fullPath}`);
      
      const module = await import(/* @vite-ignore */ fullPath)
        .catch(error => {
          routeLog('error', `组件 ${fullPath} 导入失败: ${error.message}`);
          return null;
        });
      
      if (module) {
        routeLog('success', `组件 ${fullPath} 导入成功`);
      }
    } catch (error) {
      routeLog('error', `检查组件 ${comp} 时出错: ${error}`);
    }
  }
  
  routeLog('important', '组件路径检查完成');
}

/**
 * 初始化视图组件
 * 在应用启动时调用
 */
export function initViews() {
  if (import.meta.env.DEV) {
    // 开发环境下检查组件
    setTimeout(() => {
      checkComponents();
    }, 2000);
  }
}

export default {
  checkComponents,
  initViews
}; 