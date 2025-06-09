import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 预加载组件
import Dashboard from '@/views/dashboard/index.vue'
import Layout from '@/layout/index.vue'
import { getUserMenusApiV1SystemMenuUserGet } from '@/api/caidanguanli'
import type { RouteItem } from '../types/route'
import { routeLog, printRouteInfo } from '@/utils/routeLog'

// 创建重定向组件，用于处理路由跳转和刷新
import { defineComponent, h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 重定向组件
const RedirectComponent = defineComponent({
  name: 'Redirect',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    onMounted(() => {
      const { params, query } = route
      const { path } = params
      
      // 获取重定向路径
      const redirectPath = Array.isArray(path) 
        ? '/' + path.join('/') 
        : typeof path === 'string' 
          ? '/' + path 
          : '/index'
          
      console.log('重定向到:', redirectPath, '查询参数:', query)
      
      // 执行重定向
      router.replace({
        path: redirectPath,
        query
      })
    })
    
    return () => h('div', '重定向中...')
  }
})

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字,可以是route对象里面的内容：(route)=>route.query.xx
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
    group:"group"                   // 当路由设置了该属性，则相同组的路由共用一个tab标签,可以是route对象里面的内容：(route)=>route.query.xx
    transition:"fade-transform"     // 设置该路由的切换动画，默认淡出，不需要动画可以填none，动画需要自己在transition.scss中定义
    isTopMenu: true                 // 当设置为true时，该路由的第一个子路由会在TopNav模式下显示为顶级菜单
    }
 */

// 添加全局变量保存菜单数据和加载状态
export const menuState = {
  menuData: null as any[] | null,
  menuLoaded: false,
  loadingPromise: null as Promise<any> | null,
  lastLoadTime: 0, // 最后一次加载菜单的时间
  loadingTimeout: 30000, // 30秒内不重复请求菜单
}

// 进度条配置
NProgress.configure({ showSpinner: false })

// 公共路由
export const constantRoutes: RouteItem[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      },
      {
        path: 'settings',
        component: () => import('@/views/user/settings/index.vue'),
        name: 'settings',
        meta: { title: '个人设置', icon: 'setting' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: RouteItem[] = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole.vue'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser.vue'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'DictData',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log.vue'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable.vue'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 组件映射表
const componentMap: Record<string, any> = {
  Layout, // 注册Layout组件
  Dashboard, // 注册Dashboard组件
  
  // 系统管理
  'system/user': () => import('@/views/system/user/index.vue'),
  'system/role': () => import('@/views/system/role/index.vue'),
  'system/menu': () => import('@/views/system/menu/index.vue'),
  'system/dept': () => import('@/views/system/dept/index.vue'),
  'system/post': () => import('@/views/system/post/index.vue'),
  'system/dict': () => import('@/views/system/dict/index.vue'),
  'system/config': () => import('@/views/system/config/index.vue'),
  
  // 数据库格式路径映射
  'system/user/index': () => import('@/views/system/user/index.vue'),
  'system/role/index': () => import('@/views/system/role/index.vue'),
  'system/menu/index': () => import('@/views/system/menu/index.vue'),
  'system/dept/index': () => import('@/views/system/dept/index.vue'),
  'system/post/index': () => import('@/views/system/post/index.vue'),
  'system/dict/index': () => import('@/views/system/dict/index.vue'),
  'system/config/index': () => import('@/views/system/config/index.vue'),
  
  // 别名映射，提高兼容性
  'user': () => import('@/views/system/user/index.vue'),
  'role': () => import('@/views/system/role/index.vue'),
  'menu': () => import('@/views/system/menu/index.vue'),
  'dept': () => import('@/views/system/dept/index.vue'),
  'post': () => import('@/views/system/post/index.vue'),
  'dict': () => import('@/views/system/dict/index.vue'),
  'config': () => import('@/views/system/config/index.vue'),
  
  // 系统监控
  'monitor/online': () => import('@/views/monitor/online/index.vue'),
  'monitor/job': () => import('@/views/monitor/job/index.vue'),
  'monitor/data': () => import('@/views/monitor/data/index.vue'),
  'monitor/server': () => import('@/views/monitor/server/index.vue'),
  'monitor/cache': () => import('@/views/monitor/cache/index.vue'),
  'monitor/druid': () => import('@/views/monitor/druid/index.vue'),
  
  // 数据库格式路径映射
  'monitor/online/index': () => import('@/views/monitor/online/index.vue'),
  'monitor/job/index': () => import('@/views/monitor/job/index.vue'),
  'monitor/data/index': () => import('@/views/monitor/data/index.vue'),
  'monitor/server/index': () => import('@/views/monitor/server/index.vue'),
  'monitor/cache/index': () => import('@/views/monitor/cache/index.vue'),
  'monitor/druid/index': () => import('@/views/monitor/druid/index.vue'),
  
  // 别名映射，提高兼容性
  'online': () => import('@/views/monitor/online/index.vue'),
  'job': () => import('@/views/monitor/job/index.vue'),
  'data': () => import('@/views/monitor/data/index.vue'),
  'server': () => import('@/views/monitor/server/index.vue'),
  'cache': () => import('@/views/monitor/cache/index.vue'),
  'druid': () => import('@/views/monitor/druid/index.vue'),
  
  // 系统工具
  'tool/gen': () => import('@/views/tool/gen/index.vue'),
  'tool/swagger': () => import('@/views/tool/swagger/index.vue'),
  'tool/build': () => import('@/views/tool/build/index.vue'),
  
  // 数据库格式路径映射
  'tool/gen/index': () => import('@/views/tool/gen/index.vue'),
  'tool/swagger/index': () => import('@/views/tool/swagger/index.vue'),
  'tool/build/index': () => import('@/views/tool/build/index.vue'),
  
  // 别名映射，提高兼容性
  'gen': () => import('@/views/tool/gen/index.vue'),
  'swagger': () => import('@/views/tool/swagger/index.vue'),
  'build': () => import('@/views/tool/build/index.vue'),
  
  // 个人中心
  'user/profile': () => import('@/views/user/profile/index.vue'),
  'user/settings': () => import('@/views/user/settings/index.vue'),
  
  // 其他页面
  'error/404': () => import('@/views/error/404.vue')
}

/**
 * 处理后端返回的菜单数据，转换为路由格式
 * @param menus 菜单列表
 * @returns 路由列表
 */
function formatRoutes(menus: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  
  // 安全检查，确保menus是数组
  if (!Array.isArray(menus)) {
    console.error('菜单数据不是数组:', menus);
    return routes;
  }

  console.log('处理菜单数据，总数:', menus.length);
  
  // 判断菜单数据是否已经有层级结构(含children数组)
  const hasChildrenStructure = menus.some(item => Array.isArray(item.children));
  
  if (hasChildrenStructure) {
    console.log('检测到菜单已包含children结构，使用递归处理');
    return processMenusWithChildren(menus);
  } else {
    console.log('菜单无children结构，使用parent_id处理');
    // 构建菜单树结构，再处理
    const menuTree = buildMenuTree(menus);
    return processMenusWithChildren(menuTree);
  }
}

/**
 * 处理包含children的菜单结构
 */
function processMenusWithChildren(items: any[], parentPath: string = ''): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = [];
  
  items.forEach(item => {
    // 跳过隐藏菜单 (visible为1表示隐藏)
    if (item.visible === '1') {
      return;
    }
    
    // 处理路径
    let path = item.path || '';
    
    // 根据父路径和当前路径确定最终路径
    if (parentPath && !path.startsWith('/')) {
      // 子路由不需要/前缀
      path = path.startsWith('/') ? path.substring(1) : path;
    } else if (!parentPath && !path.startsWith('/')) {
      // 顶级路由需要/前缀
      path = `/${path}`;
    }
    
    // 创建路由对象
    const route: any = {
      path,
      name: item.menu_name,
      meta: {
        title: item.menu_name,
        icon: item.icon || '',
        noCache: item.is_cache !== '0',
        perms: item.perms || ''
      }
    };
    
    // 如果是父级菜单（M类型）或没有组件
    if (item.menu_type === 'M' || !item.component) {
      route.component = Layout;
      
      // 处理子菜单
      if (item.children && item.children.length > 0) {
        // 将当前路径作为父路径传递给子菜单
        const fullPath = parentPath ? `${parentPath}/${path}` : path;
        const childRoutes = processMenusWithChildren(item.children, fullPath);
        
        if (childRoutes.length > 0) {
          route.children = childRoutes;
          
          // 设置重定向到第一个可见子菜单
          const firstVisibleChild = childRoutes.find((c: any) => !c.hidden);
          if (firstVisibleChild) {
            route.redirect = firstVisibleChild.path.startsWith('/')
              ? firstVisibleChild.path
              : `${path}/${firstVisibleChild.path}`;
          }
        }
      }
    } else {
      // 加载组件
      route.component = loadComponent(item.component);
    }
    
    result.push(route);
  });
  
  return result;
}

/**
 * 从扁平菜单列表构建菜单树
 */
function buildMenuTree(menus: any[]): any[] {
  // 按parent_id分组菜单
  const menuMap = new Map<number | string, any[]>();
  const rootMenus: any[] = [];
  
  // 按parent_id分组
  menus.forEach(menu => {
    const parentId = menu.parent_id;
    if (!menuMap.has(parentId)) {
      menuMap.set(parentId, []);
    }
    menuMap.get(parentId)?.push(menu);
  });
  
  // 查找顶级菜单并为每个菜单添加children属性
  const topMenus = menuMap.get(0) || menuMap.get('0') || [];
  console.log('找到顶级菜单数量:', topMenus.length);
  
  // 递归处理菜单树
  function setChildren(menus: any[]) {
    menus.forEach(menu => {
      const children = menuMap.get(menu.menu_id);
      if (children && children.length > 0) {
        menu.children = [...children];
        setChildren(menu.children);
      } else {
        menu.children = [];
      }
    });
  }
  
  // 设置子菜单
  setChildren(topMenus);
  
  return topMenus;
}

/**
 * 加载组件
 * @param component 组件路径
 * @returns 组件
 */
function loadComponent(component: string) {
  if (!component || component === 'Layout') {
    return Layout;
  }
  
  // 如果是内部路径
  if (component === 'InnerLink') {
    return () => import('@/layout/components/InnerLink/index.vue');
  }
  
  // 尝试直接从组件映射表加载
  if (componentMap[component]) {
    console.log(`从组件映射表直接加载: ${component}`);
    return componentMap[component];
  }
  
  // 清理路径
  let cleanPath = component;
  if (cleanPath.startsWith('@/views/')) {
    cleanPath = cleanPath.replace('@/views/', '');
  } else if (cleanPath.startsWith('@/')) {
    cleanPath = cleanPath.replace('@/', '');
  }
  
  // 移除.vue后缀
  if (cleanPath.endsWith('.vue')) {
    cleanPath = cleanPath.replace('.vue', '');
  }
  
  // 尝试清理后的路径
  if (componentMap[cleanPath]) {
    console.log(`从清理后路径加载: ${cleanPath}`);
    return componentMap[cleanPath];
  }
  
  // 针对特定模块的路径尝试
  const modulePrefixes = ['system/', 'monitor/', 'tool/'];
  for (const prefix of modulePrefixes) {
    // 检查是否已经包含模块前缀
    if (cleanPath.startsWith(prefix)) {
      const withoutPrefix = cleanPath.replace(prefix, '');
      const withPrefix = cleanPath;
      const variations = [
        withPrefix,
        withoutPrefix,
        `${prefix}${withoutPrefix}`,
        `${withPrefix}/index`,
        `${withoutPrefix}/index`
      ];
      
      for (const variation of variations) {
        if (componentMap[variation]) {
          console.log(`从模块变体加载: ${variation}`);
          return componentMap[variation];
        }
      }
    } else {
      // 尝试添加模块前缀
      const withPrefix = `${prefix}${cleanPath}`;
      const variations = [
        withPrefix,
        `${withPrefix}/index`
      ];
      
      for (const variation of variations) {
        if (componentMap[variation]) {
          console.log(`从添加前缀后加载: ${variation}`);
          return componentMap[variation];
        }
      }
    }
  }
  
  // 最后一次尝试，忽略目录结构，只看最后一部分
  if (cleanPath.includes('/')) {
    const parts = cleanPath.split('/');
    const lastPart = parts[parts.length - 1];
    
    if (componentMap[lastPart]) {
      console.log(`从最后部分加载: ${lastPart}`);
      return componentMap[lastPart];
    }
    
    for (const prefix of modulePrefixes) {
      const prefixed = `${prefix}${lastPart}`;
      if (componentMap[prefixed]) {
        console.log(`从前缀+最后部分加载: ${prefixed}`);
        return componentMap[prefixed];
      }
    }
  }
  
  // 如果组件映射表中没有找到，尝试动态导入
  console.log(`尝试动态导入组件: ${component}`);
  
  // 标准化路径格式
  let importPath = cleanPath;
  
  // 为特定组件添加额外处理
  if (component === 'druid' || component === 'monitor/druid' || component === 'monitor/druid/index') {
    console.log('检测到druid组件，使用特殊处理');
    return () => import('@/views/monitor/druid/index.vue')
      .catch(err => {
        console.error(`加载druid组件失败: ${err.message}`);
        return import('@/views/error/404.vue');
      });
  }
  
  // 对路径进行规范化处理，处理不同模块的情况
  const pathParts = importPath.split('/');
  if (pathParts.length === 1) {
    // 只有组件名，如 'druid'，尝试猜测完整路径
    const componentName = pathParts[0];
    // 尝试常见的模块路径
    const modulePaths = [
      `monitor/${componentName}/index`,
      `system/${componentName}/index`,
      `tool/${componentName}/index`
    ];
    
    // 返回一个会依次尝试多个路径的导入函数
    return () => {
      let importPromise = import('@/views/error/404.vue');
      
      // 顺序尝试每个可能的路径
      for (const path of modulePaths) {
        importPromise = importPromise.catch(() => {
          console.log(`尝试加载路径: ${path}`);
          return import(`@/views/${path}.vue`).catch(err => {
            console.log(`加载 ${path} 失败: ${err.message}`);
            throw err; // 继续传递错误以尝试下一个路径
          });
        });
      }
      
      // 如果所有路径都失败，最终返回404
      return importPromise.catch(err => {
        console.error('所有动态导入路径都失败');
        return import('@/views/error/404.vue');
      });
    };
  }
  
  // 尝试动态导入，先尝试直接路径
  try {
    console.log(`尝试导入: @/views/${importPath}.vue`);
    return () => import(`@/views/${importPath}.vue`)
      .then(module => {
        console.log(`成功动态加载组件: ${importPath}`);
        return module;
      })
      .catch(err => {
        console.log(`直接路径导入失败，尝试添加/index: ${err.message}`);
        // 如果直接导入失败，尝试添加/index
        return import(`@/views/${importPath}/index.vue`)
          .then(module => {
            console.log(`成功动态加载index组件: ${importPath}/index`);
            return module;
          })
          .catch(innerErr => {
            console.error(`所有动态导入尝试都失败: ${innerErr.message}`);
            console.warn(`未找到组件: ${component}, 使用404页面替代`);
            return import('@/views/error/404.vue');
          });
      });
  } catch (e: any) {
    console.error(`动态导入组件出错: ${e.message}`);
    return () => import('@/views/error/404.vue');
  }
}

/**
 * 获取动态路由
 */
export async function getAsyncRoutes() {
  try {
    // 检查是否有缓存的菜单数据
    const now = Date.now();
    if (menuState.menuLoaded && menuState.menuData && 
        (now - menuState.lastLoadTime) < menuState.loadingTimeout) {
      routeLog('info', '使用缓存的菜单数据');
      return formatRoutes(menuState.menuData);
    }
    
    // 检查是否已有请求在进行中
    if (menuState.loadingPromise) {
      routeLog('info', '已有菜单加载请求进行中，等待完成...');
      return await menuState.loadingPromise;
    }
    
    // 创建新的菜单获取请求
    menuState.loadingPromise = new Promise(async (resolve) => {
      try {
        // 记录请求时间
        menuState.lastLoadTime = now;
        
        // 从后端获取菜单数据
        routeLog('info', '开始请求菜单数据');
        const response = await getUserMenusApiV1SystemMenuUserGet() as any;
        routeLog('success', '菜单数据请求成功');
        
        // 提取菜单数据
        let menuData: any[] = [];
        
        // 检查返回的数据结构
        if (response && typeof response === 'object') {
          // 标准API响应格式：{ code: 200, msg: "操作成功", data: [] }
          if (response.code === 200 && Array.isArray(response.data)) {
            routeLog('success', '找到标准API响应格式', { count: response.data.length });
            menuData = response.data;
          }
          // 直接是数组
          else if (Array.isArray(response)) {
            routeLog('success', 'API响应本身是数组', { count: response.length });
            menuData = response;
          }
          // 其他嵌套格式
          else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            routeLog('success', '找到嵌套data.data格式', { count: response.data.data.length });
            menuData = response.data.data;
          }
          else if (response.result && Array.isArray(response.result)) {
            routeLog('success', '找到result字段', { count: response.result.length });
            menuData = response.result;
          }
          // 尝试遍历对象找到第一个数组
          else {
            routeLog('warning', '尝试查找对象中的数组字段');
            for (const key in response) {
              if (Array.isArray(response[key]) && response[key].length > 0) {
                routeLog('success', `找到数组字段: ${key}`, { count: response[key].length });
                menuData = response[key];
                break;
              }
            }
          }
        }
        
        routeLog('info', `提取到菜单数据，数量: ${menuData.length}`);
        
        if (menuData.length > 0) {
          // 保存菜单数据到全局状态
          menuState.menuData = menuData;
          menuState.menuLoaded = true;
          
          // 将菜单数据转换为路由
          routeLog('info', '开始生成路由');
          const routes = formatRoutes(menuData);
          // 确保核心模块路由存在
          ensureCoreModuleRoutes(routes);
          routeLog('success', `生成的路由数量: ${routes.length}`);
          
          // 打印路由信息用于调试
          printRouteInfo(routes);
          
          resolve(routes);
        } else {
          routeLog('warning', '菜单API未返回有效数据，使用默认路由');
          const defaultRoutes = generateDefaultRoutes();
          resolve(defaultRoutes);
        }
      } catch (error) {
        routeLog('error', '获取菜单数据失败:', error);
        const defaultRoutes = generateDefaultRoutes();
        resolve(defaultRoutes);
      } finally {
        // 请求完成，清除Promise引用
        menuState.loadingPromise = null;
      }
    });
    
    return await menuState.loadingPromise;
  } catch (error) {
    routeLog('error', '处理动态路由出错:', error);
    return generateDefaultRoutes();
  }
}

/**
 * 确保核心模块路由存在
 */
function ensureCoreModuleRoutes(routes: any[]) {
  // 检查是否存在系统管理路由
  if (!routes.some(route => route.path === '/system')) {
    routes.push({
      path: '/system',
      component: Layout,
      name: 'System',
      meta: { title: '系统管理', icon: 'system' },
      redirect: '/system/user',
      children: [
        {
          path: 'user',
          name: 'User',
          component: componentMap['system/user'],
          meta: { title: '用户管理', icon: 'user' }
        },
        {
          path: 'role',
          name: 'Role',
          component: componentMap['system/role'],
          meta: { title: '角色管理', icon: 'peoples' }
        },
        {
          path: 'menu',
          name: 'Menu',
          component: componentMap['system/menu'],
          meta: { title: '菜单管理', icon: 'tree-table' }
        },
        {
          path: 'dept',
          name: 'Dept',
          component: componentMap['system/dept'],
          meta: { title: '部门管理', icon: 'tree' }
        },
        {
          path: 'post',
          name: 'Post',
          component: componentMap['system/post'],
          meta: { title: '岗位管理', icon: 'post' }
        },
        {
          path: 'dict',
          name: 'Dict',
          component: componentMap['system/dict'],
          meta: { title: '字典管理', icon: 'dict' }
        },
        {
          path: 'config',
          name: 'Config',
          component: componentMap['system/config'],
          meta: { title: '参数设置', icon: 'edit' }
        }
      ]
    });
  }
  
  // 检查是否存在监控路由
  if (!routes.some(route => route.path === '/monitor')) {
    routes.push({
      path: '/monitor',
      component: Layout,
      name: 'Monitor',
      meta: { title: '系统监控', icon: 'monitor' },
      redirect: '/monitor/online',
      children: [
        {
          path: 'online',
          name: 'Online',
          component: componentMap['monitor/online'],
          meta: { title: '在线用户', icon: 'online' }
        },
        {
          path: 'job',
          name: 'Job',
          component: componentMap['monitor/job'],
          meta: { title: '定时任务', icon: 'job' }
        },
        {
          path: 'server',
          name: 'Server',
          component: componentMap['monitor/server'],
          meta: { title: '服务监控', icon: 'server' }
        },
        {
          path: 'druid',
          name: 'Druid',
          component: componentMap['monitor/druid'],
          meta: { title: '数据监控', icon: 'druid' }
        }
      ]
    });
  }
  
  // 检查是否存在工具路由
  if (!routes.some(route => route.path === '/tool')) {
    routes.push({
      path: '/tool',
      component: Layout,
      name: 'Tool',
      meta: { title: '系统工具', icon: 'tool' },
      redirect: '/tool/gen',
      children: [
        {
          path: 'gen',
          name: 'Gen',
          component: componentMap['tool/gen'],
          meta: { title: '代码生成', icon: 'code' }
        },
        {
          path: 'swagger',
          name: 'Swagger',
          component: componentMap['tool/swagger'],
          meta: { title: '系统接口', icon: 'swagger' }
        },
        {
          path: 'build',
          name: 'Build',
          component: componentMap['tool/build'],
          meta: { title: '表单构建', icon: 'build' }
        }
      ]
    });
  }
}

/**
 * 生成默认路由
 */
function generateDefaultRoutes() {
  const routes = [...dynamicRoutes];
  
  // 添加核心模块路由
  routes.push({
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'system' },
    redirect: '/system/user',
    children: [
      {
        path: 'user',
        name: 'User',
        component: componentMap['system/user'],
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: componentMap['system/role'],
        meta: { title: '角色管理', icon: 'peoples' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: componentMap['system/menu'],
        meta: { title: '菜单管理', icon: 'tree-table' }
      },
      {
        path: 'dept',
        name: 'Dept',
        component: componentMap['system/dept'],
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'post',
        name: 'Post',
        component: componentMap['system/post'],
        meta: { title: '岗位管理', icon: 'post' }
      },
      {
        path: 'dict',
        name: 'Dict',
        component: componentMap['system/dict'],
        meta: { title: '字典管理', icon: 'dict' }
      },
      {
        path: 'config',
        name: 'Config',
        component: componentMap['system/config'],
        meta: { title: '参数设置', icon: 'edit' }
      }
    ]
  });
  
  routes.push({
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    meta: { title: '系统监控', icon: 'monitor' },
    redirect: '/monitor/online',
    children: [
      {
        path: 'online',
        name: 'Online',
        component: componentMap['monitor/online'],
        meta: { title: '在线用户', icon: 'online' }
      },
      {
        path: 'job',
        name: 'Job',
        component: componentMap['monitor/job'],
        meta: { title: '定时任务', icon: 'job' }
      },
      {
        path: 'server',
        name: 'Server',
        component: componentMap['monitor/server'],
        meta: { title: '服务监控', icon: 'server' }
      },
      {
        path: 'druid',
        name: 'Druid',
        component: componentMap['monitor/druid'],
        meta: { title: '数据监控', icon: 'druid' }
      }
    ]
  });
  
  routes.push({
    path: '/tool',
    component: Layout,
    name: 'Tool',
    meta: { title: '系统工具', icon: 'tool' },
    redirect: '/tool/gen',
    children: [
      {
        path: 'gen',
        name: 'Gen',
        component: componentMap['tool/gen'],
        meta: { title: '代码生成', icon: 'code' }
      },
      {
        path: 'swagger',
        name: 'Swagger',
        component: componentMap['tool/swagger'],
        meta: { title: '系统接口', icon: 'swagger' }
      },
      {
        path: 'build',
        name: 'Build',
        component: componentMap['tool/build'],
        meta: { title: '表单构建', icon: 'build' }
      }
    ]
  });
  
  return routes;
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_ROUTER),
  routes: constantRoutes as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // 设置页面标题
  document.title = `${to.meta.title || ''} - MyFast-Admin`

  // 白名单路径，无需登录即可访问
  const whiteList = ['/login', '/404', '/401']

  // 首先判断是否正在访问登录页
  if (whiteList.includes(to.path)) {
    // 如果已登录且访问登录页，重定向到首页
    if (getToken() && to.path === '/login') {
      next({ path: '/index' })
    } else {
      // 未登录状态访问白名单页面，直接放行
      next()
    }
    NProgress.done()
    return
  }

  // 非白名单页面需要判断是否需要登录验证
  const hasToken = getToken()

  if (hasToken) {
    const userStore = useUserStore()
    
    try {
      // 获取用户信息，确保登录状态有效
      await userStore.getUserInfo()
      
      // 检查路由是否已添加
      if (!userStore.routesAdded) {
        // 添加动态路由
        const asyncRoutes = await getAsyncRoutes()
        
        // 添加路由
        asyncRoutes.forEach(route => {
          router.addRoute(route)
        })
        
        // 添加404路由（确保在所有路由之后添加）
        router.addRoute({
          path: '/:pathMatch(.*)*',
          redirect: '/404',
          meta: { hidden: true }
        })
        
        // 标记路由已添加
        userStore.routesAdded = true
        
        // 重新导航到目标路由
        next({ ...to, replace: true })
        return
      }
      
      // 如果访问根路径，重定向到首页
      if (to.path === '/') {
        next({ path: '/index' })
        return
      }
      
      next()
    } catch (error) {
      console.error('路由守卫错误:', error)
      // 获取用户信息失败，清除token并重定向到登录页
      userStore.resetUserState()
      next(`/login?redirect=${encodeURIComponent(to.path)}`)
      NProgress.done()
    }
  } else {
    // 未登录，重定向到登录页
    next(`/login?redirect=${encodeURIComponent(to.path)}`)
    NProgress.done()
  }
})

// 后置守卫
router.afterEach(() => {
  NProgress.done()
})

export default router
