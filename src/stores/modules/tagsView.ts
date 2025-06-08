import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TagView {
  title: string
  path: string
  name?: string
  fullPath?: string
  query?: Record<string, any>
}

export const useTagsViewStore = defineStore('tagsView', () => {
  // 已访问的标签
  const visitedTags = reactive<TagView[]>([{
    title: '仪表盘',
    path: '/dashboard',
    name: 'Dashboard'
  }])

  // 缓存的视图组件名称
  const cachedViews = ref<string[]>(['Dashboard'])

  // 添加访问标签
  const addVisitedTag = (route: RouteLocationNormalizedLoaded): void => {
    try {
      const { name, path, meta, fullPath, query } = route
      if (!path || path === '/login' || path === '/404') return

      // 转换name为字符串或使用备用值
      const nameStr = name ? String(name) : ''

      // 检查标签是否已存在
      const isExist = visitedTags.some((tag) => tag.path === path)
      
      if (!isExist) {
        visitedTags.push({
          title: meta?.title as string || nameStr || '未命名页面',
          path,
          fullPath,
          name: nameStr,
          query
        })
      }

      // 更新缓存视图
      if (nameStr && !cachedViews.value.includes(nameStr)) {
        cachedViews.value.push(nameStr)
      }
    } catch (error) {
      console.error('添加标签失败:', error)
    }
  }

  // 删除访问标签
  const removeVisitedTag = (path: string): TagView[] => {
    for (let i = 0, len = visitedTags.length; i < len; i++) {
      if (visitedTags[i].path === path) {
        // 从缓存中移除
        const name = visitedTags[i].name
        if (name) {
          const index = cachedViews.value.indexOf(name)
          if (index > -1) {
            cachedViews.value.splice(index, 1)
          }
        }
        
        // 从已访问标签中移除
        visitedTags.splice(i, 1)
        break
      }
    }
    return [...visitedTags]
  }

  // 关闭其他标签
  const closeOtherTags = (path?: string): void => {
    const currentPath = path || '/dashboard'
    const currentIndex = visitedTags.findIndex(tag => tag.path === currentPath)
    
    // 保留数据可视化和当前标签
    const dashboard = visitedTags.find(tag => tag.path === '/dashboard')
    const current = currentIndex > -1 ? visitedTags[currentIndex] : null
    
    // 清空标签
    visitedTags.length = 0
    
    // 添加数据可视化
    if (dashboard) {
      visitedTags.push(dashboard)
    }
    
    // 如果当前标签不是数据可视化且存在，则添加当前标签
    if (current && current.path !== '/dashboard') {
      visitedTags.push(current)
    }
    
    // 清除缓存，只保留当前页和首页
    cachedViews.value = ['Dashboard']
    if (current && current.name && current.name !== 'Dashboard') {
      cachedViews.value.push(current.name)
    }
  }

  // 关闭所有标签
  const closeAllTags = (): void => {
    // 保留数据可视化
    const dashboard = visitedTags.find(tag => tag.path === '/dashboard')
    
    // 清空标签
    visitedTags.length = 0
    
    // 添加数据可视化
    if (dashboard) {
      visitedTags.push(dashboard)
    } else {
      visitedTags.push({
        title: '数据可视化',
        path: '/dashboard',
        name: 'Dashboard'
      })
    }
    
    // 清除缓存，只保留首页
    cachedViews.value = ['Dashboard']
  }

  // 刷新页面缓存
  const refreshCache = (name: string): void => {
    const index = cachedViews.value.indexOf(name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  return {
    visitedTags,
    cachedViews,
    addVisitedTag,
    removeVisitedTag,
    closeOtherTags,
    closeAllTags,
    refreshCache
  }
}) 