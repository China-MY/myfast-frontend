/**
 * 路由日志工具
 * 用于调试和排查路由相关问题
 */

// 是否启用详细日志
const ENABLE_VERBOSE_LOG = true;

// 日志分类颜色
const LOG_COLORS = {
  info: '#2196f3',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  important: '#9c27b0'
};

/**
 * 输出路由日志
 */
export function routeLog(type: 'info' | 'success' | 'warning' | 'error' | 'important', message: string, ...args: any[]) {
  if (!ENABLE_VERBOSE_LOG && type !== 'error' && type !== 'important') {
    return;
  }
  
  console.log(
    `%c[路由] ${message}`,
    `color: ${LOG_COLORS[type]}; font-weight: bold;`,
    ...args
  );
}

/**
 * 打印路由信息
 */
export function printRouteInfo(routes: any[]) {
  if (!ENABLE_VERBOSE_LOG) return;
  
  routeLog('important', '========== 路由加载信息 ==========');
  
  function traverseRoutes(routes: any[], level = 0) {
    routes.forEach((route, index) => {
      const indent = ' '.repeat(level * 2);
      const path = route.path;
      const component = route.component ? route.component.name || '动态组件' : '未设置组件';
      
      routeLog('info', `${indent}${index + 1}. 路径: ${path}, 组件: ${component}`);
      
      if (route.children && route.children.length > 0) {
        traverseRoutes(route.children, level + 1);
      }
    });
  }
  
  traverseRoutes(routes);
  routeLog('important', '========== 路由加载完成 ==========');
}

export default {
  log: routeLog,
  printRouteInfo
}; 