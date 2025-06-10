import { loadComponent } from '@/router';
import Layout from '@/layout/index.vue';
import { routeLog } from '@/utils/routeLog';

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generateRoutes = (menus: any[]): Promise<any[]> => {
  return new Promise(resolve => {
    routeLog('info', '开始生成动态路由');
    
    // 将菜单数据转换为路由
    const accessedRoutes = formatRoutes(menus);
    accessedRoutes.push({
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/error/404.vue'),
      hidden: true
    });
    
    routeLog('success', `成功生成${accessedRoutes.length}条路由`);
    resolve(accessedRoutes);
  });
};

/**
 * 格式化路由
 * @param routes 路由
 * @returns 处理后的路由
 */
export function formatRoutes(routes: any): any[] {
  routeLog('info', '开始格式化菜单路由数据');
  
  // 检查数据结构 - 处理children结构或基于parent_id的结构
  const hasChildren = routes.some((item: any) => item.children && item.children.length > 0);
  const hasParentId = routes.some((item: any) => item.parent_id !== undefined);
  
  routeLog('info', `菜单结构: ${hasChildren ? '嵌套children' : ''}${hasParentId ? ' 基于parent_id' : ''}`);
  
  // 如果是基于parent_id的结构，先将其转换为树形结构
  let treeData = routes;
  if (hasParentId && !hasChildren) {
    routeLog('info', '检测到基于parent_id的扁平结构，转换为树形结构');
    treeData = buildMenuTree(routes);
  }
  
  // 格式化菜单树为路由
  return formatMenuTree(treeData);
}

/**
 * 将基于parent_id的扁平结构转换为树形结构
 * @param items 原始菜单数据 
 * @returns 树形结构菜单
 */
function buildMenuTree(items: any[]): any[] {
  routeLog('info', '开始构建菜单树结构');
  
  // 复制一份数据，防止修改原始数据
  const allItems = JSON.parse(JSON.stringify(items));
  
  // 创建一个映射，以便快速查找项目
  const itemMap = new Map();
  allItems.forEach((item: any) => {
    itemMap.set(item.menu_id, {...item, children: []});
  });
  
  // 构建树结构
  const rootItems: any[] = [];
  
  allItems.forEach((item: any) => {
    const id = item.menu_id;
    const parentId = item.parent_id;
    
    // 获取映射中的对象（带children数组）
    const currentItem = itemMap.get(id);
    
    if (parentId === 0 || parentId === null || parentId === undefined) {
      // 根节点
      rootItems.push(currentItem);
    } else {
      // 将当前项添加到父项的children数组
      const parentItem = itemMap.get(parentId);
      if (parentItem) {
        parentItem.children.push(currentItem);
      } else {
        // 如果找不到父项，当作根节点处理
        routeLog('warning', `找不到菜单项 ${id} 的父项 ${parentId}，将其作为根节点处理`);
        rootItems.push(currentItem);
      }
    }
  });
  
  routeLog('success', `成功构建菜单树，共 ${rootItems.length} 个根节点`);
  return rootItems;
}

/**
 * 递归格式化菜单树为路由
 * @param menus 菜单树
 * @param parentPath 父路径
 * @returns 路由数组
 */
function formatMenuTree(menus: any[], parentPath = ''): any[] {
  if (!menus) return [];
  
  return menus.map(menu => {
    // 构建完整路径
    let path = menu.path || '';
    if (!path.startsWith('/') && !path.startsWith('http')) {
      path = parentPath ? `${parentPath}/${path}` : `/${path}`;
    }
    
    // 规范化路径，移除多余的斜杠
    path = path.replace(/\/+/g, '/');
    
    // 获取组件路径
    const component = menu.component || '';
    
    // 创建路由对象
    const route: any = {
      path: path,
      name: menu.name || '',
      component: loadComponent(component),
      meta: {
        title: menu.menu_name || menu.title || '',
        icon: menu.icon || '',
        noCache: menu.no_cache === undefined ? true : menu.no_cache,
        link: menu.link || null
      },
      hidden: menu.hidden || menu.visible === '0'
    };
    
    // 记录路由创建
    routeLog('info', `创建路由: ${path} -> ${component}`);
    
    // 处理子路由
    const children = menu.children || [];
    if (children && children.length > 0) {
      // 根据组件类型决定如何处理子路由
      if (component === 'Layout') {
        // 直接将子路由添加到routes
        route.children = formatMenuTree(children, path);
      } else {
        // 创建一个Layout作为中间容器
        const childRoute: any = {
          path: '',
          component: loadComponent(component),
          name: menu.name || '',
          meta: {
            title: menu.menu_name || menu.title || '',
            icon: menu.icon || '',
            link: menu.link || null
          },
          hidden: menu.hidden || menu.visible === '0'
        };
        
        route.component = Layout;
        route.children = [childRoute, ...formatMenuTree(children, path)];
      }
    }
    
    return route;
  });
} 