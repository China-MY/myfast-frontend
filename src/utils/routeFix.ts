/**
 * 路由修复工具
 * 用于解决路由导入404问题
 */

import { routeLog } from './routeLog';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import type { Router } from 'vue-router';
import { loadComponent } from '../router';

// 定义修复路由列表
const fixRoutes: RouteRecordRaw[] = [
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/server',
    name: 'Monitor',
    meta: { title: '系统监控', icon: 'monitor' },
    children: [
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/monitor/server/index.vue').catch(() => import('../views/error/404.vue')),
        meta: { title: '服务器监控', icon: 'server' }
      },
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/monitor/online/index.vue').catch(() => import('../views/error/404.vue')),
        meta: { title: '在线用户', icon: 'online' }
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import('@/views/monitor/job/index.vue').catch(() => import('../views/error/404.vue')),
        meta: { title: '定时任务', icon: 'job' }
      }
    ]
  }
];

/**
 * 应用路由修复
 * @param router Vue Router实例
 */
export function applyRouteFixes(router: Router) {
  ///console.log('[路由] 开始应用路由修复...');
  
  // 1. 修复监控路由
  fixMonitorRoutes(router);

  // 2. 检查组件路径
  checkComponentPaths(router);
  
  // 3. 添加通用错误处理
  addErrorHandlers(router);

  ///console.log('[路由] 路由修复完成');
}

/**
 * 修复监控路由
 */
function fixMonitorRoutes(router: Router) {
  // 获取已注册的路由
  const routes = router.getRoutes();

  // 检查是否需要添加监控路由
  if (!routes.some(route => route.path === '/monitor')) {
    ///console.log('[路由] 添加修复路由: /monitor');
    
    // 添加监控路由
    router.addRoute({
      path: '/monitor',
      component: loadComponent('Layout'),
      name: 'Monitor',
      meta: { title: '系统监控', icon: 'monitor' },
      children: [
        {
          path: 'server',
          name: 'Server',
          component: () => import('@/views/monitor/server/index.vue').catch(() => import('../views/error/404.vue')),
          meta: { title: '服务监控', icon: 'server' }
        }
      ]
    });
  }
}

/**
 * 检查组件路径
 */
function checkComponentPaths(router: Router) {
  ///console.log('[路由] 开始检查组件路径...');
  
  // 需要检查的组件路径
  const componentsToCheck = [
    '@/views/monitor/server/index.vue',
    '@/views/monitor/online/index.vue',
    '@/views/monitor/job/index.vue',
    '@/views/system/user/index.vue',
    '@/views/system/role/index.vue',
    '@/views/system/menu/index.vue',
    '@/views/system/dict/index.vue',
    '@/views/system/config/index.vue',
    '@/views/tool/gen/index.vue',
    '@/views/tool/swagger/index.vue',
  ];
  
  // 尝试导入每个组件，检查是否能正确解析
  componentsToCheck.forEach(path => {
    ///console.log('[路由] 检查组件:', path);
    try {
      import(/* @vite-ignore */ path)
        .then(() => {
          ///console.log('[路由] 组件存在:', path);
        })
        .catch(err => {
          ///console.log('[路由] 组件', path, '导入失败:', err.message);
        });
    } catch (error) {
      ///console.log('[路由] 组件', path, '导入失败:', (error as Error).message);
    }
  });
  
  ///console.log('[路由] 组件路径检查完成');
}

/**
 * 添加错误处理
 */
function addErrorHandlers(router: Router) {
  // 全局路由错误处理
  router.onError((error) => {
    ///console.error('[路由] 路由错误:', error);
    
    // 如果是组件加载失败，尝试导航到404页面
    if (error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Failed to resolve module specifier')) {
      router.push('/404');
    }
  });
}

export default {
  applyRouteFixes,
  fixRoutes
}; 