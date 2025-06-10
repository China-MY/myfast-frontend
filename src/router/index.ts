import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 预加载组件
import Layout from '@/layout/index.vue'
import { getUserMenusApiV1SystemMenuUserGet } from '@/api/caidanguanli'
import type { RouteItem } from '../types/route'
import { applyRouteFixes } from '@/utils/routeFix'

// 重定向组件
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
  routesAdded: false, // 是否已添加动态路由
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

/**
 * 使用静态导入替代动态导入 - 基础组件
 */
const staticComponents = {
  // 布局组件
  'Layout': Layout,
  'ParentView': Layout,
  'InnerLink': () => import('@/layout/components/InnerLink/index.vue'),
  
  // 404页面保证一定能导入成功
  'error/404': () => import('@/views/error/404.vue'),
  'error/401': () => import('@/views/error/401.vue'),
  
  // 系统通用页面
  'dashboard/index': () => import('@/views/dashboard/index.vue').catch(() => import('@/views/error/404.vue')),
  'index': () => import('@/views/dashboard/index.vue').catch(() => import('@/views/error/404.vue')),
  'redirect/index': () => import('@/views/redirect/index.vue').catch(() => import('@/views/error/404.vue')),
  
  // 用户中心页面
  'user/profile/index': () => import('@/views/user/profile/index.vue').catch(() => import('@/views/error/404.vue')),
  'user/settings/index': () => import('@/views/user/settings/index.vue').catch(() => import('@/views/error/404.vue')),
  
  // 常用系统管理页面
  'system/user/index': () => import('@/views/system/user/index.vue').catch(() => import('@/views/error/404.vue')),
  'system/role/index': () => import('@/views/system/role/index.vue').catch(() => import('@/views/error/404.vue')),
  'system/menu/index': () => import('@/views/system/menu/index.vue').catch(() => import('@/views/error/404.vue')),
  'system/dept/index': () => import('@/views/system/dept/index.vue').catch(() => import('@/views/error/404.vue')),
  'system/dict/index': () => import('@/views/system/dict/index.vue').catch(() => import('@/views/error/404.vue')),
  'system/post/index': () => import('@/views/system/post/index.vue').catch(() => import('@/views/error/404.vue')),
  
  // 监控页面
  'monitor/online/index': () => import('@/views/monitor/online/index.vue').catch(() => import('@/views/error/404.vue')),
  'monitor/job/index': () => import('@/views/monitor/job/index.vue').catch(() => import('@/views/error/404.vue')),
  'monitor/server/index': () => import('@/views/monitor/server/index.vue').catch(() => import('@/views/error/404.vue')),
  
  // 工具页面
  'tool/gen/index': () => import('@/views/tool/gen/index.vue').catch(() => import('@/views/error/404.vue')),
  'tool/swagger/index': () => import('@/views/tool/swagger/index.vue').catch(() => import('@/views/error/404.vue')),
  'tool/build/index': () => import('@/views/tool/build/index.vue').catch(() => import('@/views/error/404.vue')),
  
  // 测试页面
  'test/index': () => import('@/views/test/index.vue').catch(() => import('@/views/error/404.vue')),
}

/**
 * 组件导入助手函数 - 支持多种组件路径格式
 * @param component 组件路径
 * @returns 组件导入函数
 */
function importComponent(component: string) {
  // 首先检查是否有静态定义的组件
  if (staticComponents[component]) {
    console.log(`从静态映射加载组件: ${component}`)
    return staticComponents[component]
  }
  
  // 返回一个导入函数，确保即使组件不存在也不会报错
  return () => {
    console.log(`尝试动态导入组件: ${component}`)
    
    try {
      // 规范化路径，确保格式一致
      const normalizedPath = component.replace(/\.vue$/, '').replace(/^@\/views\//, '')
      
      // 分解路径，支持多级目录结构
      const pathParts = normalizedPath.split('/')
      
      // 根据路径层级选择不同的导入策略
      if (pathParts.length === 1) {
        // 单文件组件
        return import(`../views/${pathParts[0]}.vue`)
          .catch(() => {
            console.warn(`单文件组件导入失败: ${component}`)
            return import('@/views/error/404.vue')
          })
      } 
      else if (pathParts.length === 2) {
        // 两级目录组件
        return import(`../views/${pathParts[0]}/${pathParts[1]}.vue`)
          .catch(() => {
            // 尝试使用index.vue
            return import(`../views/${pathParts[0]}/${pathParts[1]}/index.vue`)
              .catch(() => {
                console.warn(`两级目录组件导入失败: ${component}`)
                return import('@/views/error/404.vue')
              })
          })
      }
      else if (pathParts.length >= 3) {
        // 多级目录组件
        const modulePath = pathParts.slice(0, -1).join('/')
        const fileName = pathParts[pathParts.length - 1]
        
        return import(`../views/${modulePath}/${fileName}.vue`)
          .catch(() => {
            // 尝试作为目录处理
            return import(`../views/${modulePath}/${fileName}/index.vue`)
              .catch(() => {
                console.warn(`多级目录组件导入失败: ${component}`)
                return import('@/views/error/404.vue')
              })
          })
      }
      
      // 默认返回404
      console.warn(`未能识别的组件路径: ${component}`)
      return import('@/views/error/404.vue')
    } 
    catch (error) {
      console.error(`导入组件 ${component} 时发生异常:`, error)
      return import('@/views/error/404.vue')
    }
  }
}

/**
 * 动态菜单组件映射
 */
export const componentMap: Record<string, any> = {
  // 布局组件
  'Layout': Layout,
  'ParentView': Layout,
  'InnerLink': () => import('@/layout/components/InnerLink/index.vue'),
}

// 添加常用组件的映射
const moduleGroups = {
  // 系统管理模块
  system: [
    'user', 'role', 'menu', 'dept', 'post', 'dict', 'config', 'notice'
  ],
  // 监控管理模块
  monitor: [
    'online', 'job', 'server', 'cache', 'druid'
  ],
  // 工具管理模块
  tool: [
    'gen', 'swagger', 'build'
  ]
}

// 为每个模块和组件自动生成映射
Object.entries(moduleGroups).forEach(([module, components]) => {
  components.forEach(component => {
    // 生成两种路径格式的映射 (如"system/user"和"system/user/index")
    const basePath = `${module}/${component}`
    const indexPath = `${module}/${component}/index`
    
    // 同时为两种路径添加映射，指向同一个组件
    componentMap[basePath] = importComponent(indexPath)
    componentMap[indexPath] = importComponent(indexPath)
  })
})

// 特殊组件的映射
componentMap['system/log/operlog'] = importComponent('system/log/operlog')
componentMap['system/log/logininfor'] = importComponent('system/log/logininfor') 
componentMap['test'] = importComponent('test/index')
componentMap['test/index'] = importComponent('test/index')

/**
 * 根据组件路径加载组件
 * @param component 组件路径
 * @returns 组件
 */
export function loadComponent(component: string) {
  console.log('尝试加载组件:', component)
  
  // 基础情况处理
  if (!component) return Layout
  if (component === 'Layout' || component === 'ParentView') return Layout
  if (component === 'InnerLink') return componentMap['InnerLink']
  
  // 规范化组件路径
  let normalizedComponent = component
    .replace(/^@\/views\//, '') // 去掉@/views/前缀
    .replace(/\.vue$/, '')      // 去掉.vue后缀
  
  console.log('规范化后的组件路径:', normalizedComponent)
  
  // 尝试从静态组件映射中获取
  if (staticComponents[normalizedComponent]) {
    console.log('从静态组件映射加载:', normalizedComponent)
    return staticComponents[normalizedComponent]
  }
  
  // 尝试从组件映射表中获取
  if (componentMap[normalizedComponent]) {
    console.log('从组件映射表加载:', normalizedComponent)
    return componentMap[normalizedComponent]
  }
  
  // 处理无index后缀的路径
  const withIndex = normalizedComponent.endsWith('/index') 
    ? normalizedComponent 
    : `${normalizedComponent}/index`
  
  if (componentMap[withIndex]) {
    console.log('从组件映射表加载(添加/index):', withIndex)
    return componentMap[withIndex]
  }
  
  // 处理有index后缀的路径
  if (normalizedComponent.endsWith('/index')) {
    const withoutIndex = normalizedComponent.replace(/\/index$/, '')
    if (componentMap[withoutIndex]) {
      console.log('从组件映射表加载(去掉/index):', withoutIndex)
      return componentMap[withoutIndex]
    }
  }
  
  // 如果路径已经正确格式化，但不在映射表中，先添加到映射表
  if (!componentMap[normalizedComponent]) {
    console.log('为新路径创建组件映射:', normalizedComponent)
    componentMap[normalizedComponent] = importComponent(normalizedComponent)
    
    // 同时创建带/index的版本
    if (!normalizedComponent.endsWith('/index')) {
      const indexPath = `${normalizedComponent}/index`
      componentMap[indexPath] = componentMap[normalizedComponent]
    }
  }
  
  return componentMap[normalizedComponent]
}

/**
 * 处理API返回的菜单数据，转换为路由格式
 */
function formatMenuToRoutes(menus: any[]): RouteRecordRaw[] {
  if (!Array.isArray(menus)) {
    console.error('菜单数据不是数组')
    return []
  }
  
  console.log('正在处理的原始菜单数据:', menus)
  const routes: RouteRecordRaw[] = []
  
  menus.forEach(menu => {
    // 检查菜单是否隐藏
    if (menu.visible === '1' || menu.hidden) {
      console.log(`跳过隐藏菜单: ${menu.menu_name || menu.name}`)
      return
    }
    
    // 确保路径格式正确
    const path = menu.path || menu.url || ''
    const routePath = path.startsWith('/') ? path : `/${path}`
    
    // 创建路由对象
    const route: any = {
      path: routePath,
      name: menu.menu_name || menu.name || menu.title,
      meta: {
        title: menu.menu_name || menu.title || menu.name || '未命名菜单',
        icon: menu.icon,
        noCache: menu.is_cache !== '0' && menu.is_cache !== 0,
        perms: menu.perms || menu.permission
      }
    }
    
    // 如果meta里有其他属性，也复制过来
    if (menu.meta) {
      route.meta = { ...route.meta, ...menu.meta }
    }
    
    // 处理菜单类型
    const hasChildren = menu.children && menu.children.length > 0
    
    // 处理组件类型
    if (menu.menu_type === 'M' || menu.type === 'M' || hasChildren) {
      // 目录类型，使用Layout组件
      route.component = Layout
      
      // 处理子菜单
      if (hasChildren) {
        const childRoutes = formatChildRoutes(menu.children, path)
        route.children = childRoutes
        
        // 设置重定向到第一个子菜单
        if (childRoutes.length > 0) {
          const firstValidPath = childRoutes.find(r => !(r.meta?.hidden))?.path || childRoutes[0].path
          route.redirect = route.path.replace(/\/$/, '') + '/' + firstValidPath
        }
      }
    } else if (menu.menu_type === 'C' || menu.type === 'C' || menu.component) {
      // 具体的菜单页面
      console.log('处理菜单页面组件:', menu.component)
      route.component = loadComponent(menu.component)
    } else {
      // 默认处理
      console.log('默认处理组件:', menu.component || 'error/404')
      route.component = loadComponent(menu.component || 'error/404')
    }
    
    routes.push(route)
  })
  
  console.log('转换后的路由数据:', routes)
  return routes
}

/**
 * 处理子路由
 */
function formatChildRoutes(children: any[], parentPath: string): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  
  // 确保parentPath格式正确
  const normalizedParentPath = parentPath.startsWith('/') ? parentPath : `/${parentPath}`
  
  children.forEach(child => {
    // 检查菜单是否隐藏
    if (child.visible === '1' || child.hidden) {
      return
    }
    
    // 确保路径格式正确
    let childPath = child.path || child.url || ''
    if (childPath.startsWith('/')) {
      // 如果是绝对路径，直接使用
      childPath = childPath.substring(1) // 移除开头的斜杠
    }
    
    // 创建子路由
    const route: any = {
      path: childPath,
      name: child.menu_name || child.name || child.title,
      meta: {
        title: child.menu_name || child.title || child.name || '未命名菜单',
        icon: child.icon,
        noCache: child.is_cache !== '0' && child.is_cache !== 0,
        perms: child.perms || child.permission
      }
    }
    
    // 如果meta里有其他属性，也复制过来
    if (child.meta) {
      route.meta = { ...route.meta, ...child.meta }
    }
    
    // 如果还有子菜单，递归处理
    if (child.children && child.children.length > 0) {
      // 嵌套子菜单的处理
      if (child.menu_type === 'M' || child.type === 'M') {
        route.component = Layout
      } else {
        // 常见的组件嵌套模式，使用父组件作为容器
        route.component = loadComponent(child.component || 'ParentView')
      }
      
      // 递归处理子菜单
      const fullPath = `${normalizedParentPath}/${childPath}`.replace(/\/\//g, '/')
      route.children = formatChildRoutes(child.children, fullPath)
      
      // 如果有子路由，设置重定向
      if (route.children.length > 0) {
        const firstValidPath = route.children.find(r => !(r.meta?.hidden))?.path || route.children[0].path
        route.redirect = `${childPath}/${firstValidPath}`.replace(/\/\//g, '/')
      }
    } else {
      // 加载具体的组件
      console.log('加载子路由组件:', child.component)
      route.component = loadComponent(child.component)
    }
    
    routes.push(route)
  })
  
  return routes
}

/**
 * 获取动态路由
 */
export async function getAsyncRoutes() {
  try {
    // 检查是否有缓存的菜单数据
    const now = Date.now()
    if (menuState.menuLoaded && menuState.menuData && 
        (now - menuState.lastLoadTime) < menuState.loadingTimeout) {
      console.log('使用缓存的菜单数据')
      const routes = formatMenuToRoutes(menuState.menuData)
      return routes
    }
    
    // 检查是否已有请求在进行中
    if (menuState.loadingPromise) {
      console.log('检测到进行中的菜单请求，等待完成')
      return await menuState.loadingPromise
    }
    
    // 创建新的菜单获取请求
    menuState.loadingPromise = new Promise(async (resolve) => {
      try {
        // 记录请求时间
        menuState.lastLoadTime = now
        console.log('开始获取菜单数据...')
        
        // 从后端获取菜单数据
        const response = await getUserMenusApiV1SystemMenuUserGet() as any
        console.log('API原始菜单数据:', response)
        
        // 提取菜单数据
        let menuData: any[] = []
        
        if (response) {
          try {
            // 处理不同的响应结构
            if (response.data?.code === 200 && Array.isArray(response.data?.data)) {
              // axios包装的响应: { data: { code: 200, msg: "操作成功", data: [...] } }
              menuData = response.data.data
            } else if (response.code === 200 && Array.isArray(response.data)) {
              // 标准响应格式: { code: 200, msg: "操作成功", data: [...] }
              menuData = response.data
            } else if (Array.isArray(response)) {
              // 直接返回数组
              menuData = response
            } else if (Array.isArray(response.data)) {
              // { data: [...] }
              menuData = response.data
            } else if (response.result && Array.isArray(response.result)) {
              // { result: [...] }
              menuData = response.result
            } else {
              // 尝试从其他属性找到菜单数组
              const possibleArrays = Object.values(response)
                .filter(val => Array.isArray(val) && val.length > 0)
              
              if (possibleArrays.length > 0) {
                // 使用第一个找到的数组
                menuData = possibleArrays[0] as any[]
                console.log('从其他属性找到菜单数据:', menuData)
              }
            }
          } catch (error) {
            console.error('解析菜单数据出错:', error)
          }
        }
        
        console.log('解析后的菜单数据:', menuData)
        
        if (menuData && menuData.length > 0) {
          // 保存菜单数据到全局状态
          menuState.menuData = menuData
          menuState.menuLoaded = true
          
          // 将菜单数据转换为路由
          const routes = formatMenuToRoutes(menuData)
          console.log('生成的路由:', routes)
          
          // 合并动态路由和基础权限路由
          const finalRoutes = [...routes, ...dynamicRoutes]
          
          // 设置路由已添加标记
          menuState.routesAdded = true
          
          resolve(finalRoutes)
        } else {
          // 菜单数据为空，使用默认路由
          console.warn('菜单数据为空，使用默认动态路由')
          resolve(dynamicRoutes)
        }
      } catch (error) {
        // 发生错误，使用默认路由
        console.error('获取菜单数据出错:', error)
        resolve(dynamicRoutes)
      } finally {
        // 请求完成，清除Promise引用
        menuState.loadingPromise = null
      }
    })
    
    return await menuState.loadingPromise
  } catch (error) {
    console.error('处理路由出错:', error)
    return dynamicRoutes
  }
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_ROUTER),
  routes: constantRoutes as unknown as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 应用路由修复
applyRouteFixes(router)

// 监听自定义事件，处理路由重新加载
document.addEventListener('reload-async-routes', async () => {
  console.log('[Router] 接收到路由重新加载请求');
  
  // 如果已经标记为已加载，则不再重新加载
  if (menuState.routesAdded) {
    console.log('[Router] 路由已加载，无需重新加载');
    return;
  }
  
  try {
    // 获取动态路由
    const asyncRoutes = await getAsyncRoutes();
    
    // 添加路由
    asyncRoutes.forEach(route => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    
    // 添加404路由（确保在所有路由之后添加）
    router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      meta: { hidden: true }
    });
    
    console.log('[Router] 通过事件重新加载路由完成');
  } catch (error) {
    console.error('[Router] 重新加载路由时出错:', error);
  }
});

// 前置守卫
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()
  
  console.log(`[路由] 导航开始: ${from.path} => ${to.path}`)

  // 设置页面标题
  document.title = `${to.meta.title || ''} - MyFast-Admin`

  // 白名单路径，无需登录即可访问
  const whiteList = ['/login', '/404', '/401']

  // 首先判断是否正在访问登录页或白名单页面
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
    try {
      const userStore = useUserStore()
      
      // 获取用户信息，确保登录状态有效
      await userStore.getUserInfo()
      
      // 检查路由是否已添加 - 从全局menuState获取状态
      if (!menuState.routesAdded) {
        console.log('[路由] 开始添加动态路由')
        
        try {
          // 添加动态路由
          const asyncRoutes = await getAsyncRoutes()
          
          // 添加路由
          asyncRoutes.forEach(route => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          
          // 添加404路由（确保在所有路由之后添加）
          router.addRoute({
            path: '/:pathMatch(.*)*',
            redirect: '/404',
            meta: { hidden: true }
          })
          
          // 重新导航到目标路由
          next({ ...to, replace: true })
          return
        } catch (error) {
          console.error('[路由] 添加动态路由出错:', error)
          next(`/500?message=${encodeURIComponent('加载路由失败')}`)
          NProgress.done()
          return
        }
      }
      
      // 如果访问根路径，重定向到首页
      if (to.path === '/') {
        next({ path: '/index' })
        return
      }
      
      next()
    } catch (error) {
      console.error('[路由] 认证出错:', error)
      // 获取用户信息失败，清除token并重定向到登录页
      const userStore = useUserStore()
      userStore.resetUserState()
      // 同时重置路由状态
      menuState.routesAdded = false
      next(`/login?redirect=${encodeURIComponent(to.path)}&reason=auth_failed`)
      NProgress.done()
    }
  } else {
    // 未登录，重定向到登录页
    next(`/login?redirect=${encodeURIComponent(to.path)}`)
    NProgress.done()
  }
})

// 后置守卫
router.afterEach((to, from) => {
  NProgress.done()
  console.log(`[路由] 导航完成: ${from.path} => ${to.path}`)
})

export default router
