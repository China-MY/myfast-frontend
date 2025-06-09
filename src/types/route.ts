import { type RouteRecordRaw } from 'vue-router'

/**
 * 扩展路由元数据类型
 */
interface RouteMeta {
  /** 设置该路由在侧边栏和面包屑中展示的名字 */
  title?: string | ((route: RouteItem) => string)
  /** 设置该路由的图标 */
  icon?: string
  /** 是否在侧边栏中隐藏 */
  hidden?: boolean
  /** 角色权限 */
  roles?: string[]
  /** 菜单权限 */
  permissions?: string[]
  /** 如果设置为true，则不会被 <keep-alive> 缓存 */
  noCache?: boolean
  /** 如果设置为false，则不会在breadcrumb面包屑中显示 */
  breadcrumb?: boolean
  /** 当路由设置了该属性，则会高亮相对应的侧边栏 */
  activeMenu?: string
  /** 是否在标签页中固定显示 */
  affix?: boolean
  /** 当路由设置了该属性，则相同组的路由共用一个tab标签 */
  group?: string | ((route: RouteItem) => string)
  /** 设置该路由的切换动画 */
  transition?: string
  /** 设置为顶级菜单 */
  isTopMenu?: boolean
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 扩展路由记录接口
 */
export interface RouteItem extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  /** 是否隐藏路由 */
  hidden?: boolean
  /** 角色权限 */
  roles?: string[]
  /** 菜单权限 */
  permissions?: string[]
  /** 是否总是显示根菜单 */
  alwaysShow?: boolean
  /** 路由元数据 */
  meta?: RouteMeta
  /** 子路由 */
  children?: RouteItem[]
  /** 其他自定义属性 */
  [key: string]: any
} 