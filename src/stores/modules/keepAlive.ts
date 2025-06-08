import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useKeepAliveStore = defineStore('keepAlive', () => {
  // 需要缓存的页面组件名称列表
  const keepAlivePages = ref<string[]>(['Dashboard'])

  // 获取当前需要缓存的页面列表
  const getKeepAlivePages = computed(() => keepAlivePages.value)

  // 添加需要缓存的页面
  const addKeepAlivePage = (name: string) => {
    if (!keepAlivePages.value.includes(name)) {
      keepAlivePages.value.push(name)
    }
  }

  // 移除缓存页面
  const removeKeepAlivePage = (name: string) => {
    const index = keepAlivePages.value.indexOf(name)
    if (index > -1) {
      keepAlivePages.value.splice(index, 1)
    }
  }

  // 清空缓存列表，只保留Dashboard
  const clearKeepAlivePages = () => {
    keepAlivePages.value = ['Dashboard']
  }

  // 刷新指定页面（先移除再添加）
  const refreshKeepAlivePage = (name: string) => {
    removeKeepAlivePage(name)
    // 可以通过延时添加回来实现更完善的刷新效果
    setTimeout(() => {
      addKeepAlivePage(name)
    }, 10)
  }

  return {
    keepAlivePages,
    getKeepAlivePages,
    addKeepAlivePage,
    removeKeepAlivePage,
    clearKeepAlivePages,
    refreshKeepAlivePage
  }
}) 