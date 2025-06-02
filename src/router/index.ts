import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 进度条配置
NProgress.configure({ showSpinner: false })

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'DashboardOutlined' }
      }
    ]
  }
]

// 动态路由，需要根据用户角色动态加载
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'SettingOutlined', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserOutlined',
          roles: ['admin'],
          permissions: ['system:user:list']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'SafetyCertificateOutlined',
          roles: ['admin'],
          permissions: ['system:role:list']
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'MenuOutlined',
          roles: ['admin'],
          permissions: ['system:menu:list']
        }
      },
      {
        path: 'dept',
        name: 'Dept',
        component: () => import('@/views/system/dept/index.vue'),
        meta: {
          title: '部门管理',
          icon: 'TeamOutlined',
          roles: ['admin'],
          permissions: ['system:dept:list']
        }
      },
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/views/system/post/index.vue'),
        meta: {
          title: '岗位管理',
          icon: 'IdcardOutlined',
          roles: ['admin'],
          permissions: ['system:post:list']
        }
      },
      {
        path: 'dict',
        name: 'Dict',
        component: () => import('@/views/system/dict/index.vue'),
        meta: {
          title: '字典管理',
          icon: 'EditOutlined',
          roles: ['admin'],
          permissions: ['system:dict:list']
        }
      },
      {
        path: 'dict/data/:dictType',
        name: 'DictData',
        component: () => import('@/views/system/dict/data.vue'),
        meta: {
          title: '字典数据',
          icon: 'EditOutlined',
          roles: ['admin'],
          permissions: ['system:dict:list'],
          hidden: true,
          activeMenu: '/system/dict'
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/system/config/index.vue'),
        meta: {
          title: '参数设置',
          icon: 'ControlOutlined',
          roles: ['admin'],
          permissions: ['system:config:list']
        }
      }
    ]
  },
  {
    path: '/monitor',
    component: () => import('@/layout/index.vue'),
    redirect: '/monitor/server',
    meta: { title: '系统监控', icon: 'MonitorOutlined', roles: ['admin'] },
    children: [
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/monitor/online/index.vue'),
        meta: {
          title: '在线用户',
          icon: 'UserSwitchOutlined',
          roles: ['admin'],
          permissions: ['monitor:online:list']
        }
      },
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/monitor/server/index.vue'),
        meta: {
          title: '服务器监控',
          icon: 'CloudServerOutlined',
          roles: ['admin'],
          permissions: ['monitor:server:list']
        }
      },
      {
        path: 'cache',
        name: 'Cache',
        component: () => import('@/views/monitor/cache/index.vue'),
        meta: {
          title: '缓存监控',
          icon: 'DatabaseOutlined',
          roles: ['admin'],
          permissions: ['monitor:cache:list']
        }
      },
      {
        path: 'cache/list',
        name: 'CacheList',
        component: () => import('@/views/monitor/cache/list.vue'),
        meta: {
          title: '缓存列表',
          icon: 'OrderedListOutlined',
          roles: ['admin'],
          permissions: ['monitor:cache:list'],
          hidden: true,
          activeMenu: '/monitor/cache'
        }
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import('@/views/monitor/job/index.vue'),
        meta: {
          title: '定时任务',
          icon: 'FieldTimeOutlined',
          roles: ['admin'],
          permissions: ['monitor:job:list']
        }
      },
      {
        path: 'data',
        name: 'Data',
        component: () => import('@/views/monitor/data/index.vue'),
        meta: {
          title: '数据监控',
          icon: 'LineChartOutlined',
          roles: ['admin'],
          permissions: ['monitor:data:list']
        }
      }
    ]
  },
  {
    path: '/tool',
    component: () => import('@/layout/index.vue'),
    redirect: '/tool/gen',
    meta: { title: '系统工具', icon: 'ToolOutlined', roles: ['admin'] },
    children: [
      {
        path: 'gen',
        name: 'Gen',
        component: () => import('@/views/tool/gen/index.vue'),
        meta: {
          title: '代码生成',
          icon: 'CodeOutlined',
          roles: ['admin'],
          permissions: ['tool:gen:list']
        }
      },
      {
        path: 'swagger',
        name: 'Swagger',
        component: () => import('@/views/tool/swagger/index.vue'),
        meta: {
          title: 'API文档',
          icon: 'ApiOutlined',
          roles: ['admin'],
          permissions: ['tool:swagger:list']
        }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/tool/form/index.vue'),
        meta: {
          title: '表单构建',
          icon: 'FormOutlined',
          roles: ['admin'],
          permissions: ['tool:form:list']
        }
      }
    ]
  },
  // 匹配所有路径
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// 前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // 设置页面标题
  document.title = `${to.meta.title || ''} - MyFast-Admin`

  // 获取token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录状态下访问登录页，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const userStore = useUserStore()
      const hasRoles = userStore.roles && userStore.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const userInfo = await userStore.getUserInfo()

          if (userInfo) {
            // 根据角色动态生成路由
            const accessRoutes = filterAsyncRoutes(asyncRoutes, userStore.roles, userStore.permissions)

            // 添加动态路由
            accessRoutes.forEach(route => {
              router.addRoute(route)
            })

            // 确保添加路由已完成，然后重新导航到目标页面
            next({ ...to, replace: true })
          } else {
            throw new Error('获取用户信息失败')
          }
        } catch (error) {
          console.error('路由守卫错误:', error)
          // 获取用户信息失败，清除token并重定向到登录页
          userStore.resetUserState()
          next(`/login?redirect=${encodeURIComponent(to.path)}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录，如果访问的是白名单页面则放行，否则重定向到登录页
    if (['/login', '/404'].indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.path)}`)
      NProgress.done()
    }
  }
})

// 后置守卫
router.afterEach(() => {
  NProgress.done()
})

// 根据用户角色和权限过滤路由
function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[], permissions: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp = { ...route }

    if (hasPermission(roles, permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

// 判断是否有权限
function hasPermission(roles: string[], permissions: string[], route: RouteRecordRaw): boolean {
  if (route.meta) {
    // 检查角色权限
    if (route.meta.roles) {
      return roles.some(role => (route.meta?.roles as string[]).includes(role))
    }

    // 检查操作权限
    if (route.meta.permissions) {
      return permissions.some(permission => (route.meta?.permissions as string[]).includes(permission))
    }

    // 如果没有定义权限要求，则默认可访问
    return true
  }

  // 默认可访问
  return true
}

export default router
