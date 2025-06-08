import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebar = ref({
    opened: true, // true表示打开，false表示关闭
    withoutAnimation: false
  })

  // 设备类型
  const device = ref('desktop') // 'desktop' or 'mobile'

  // 主题
  const theme = ref(localStorage.getItem('theme') || 'light') // 'light' or 'dark'

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
  }

  // 关闭侧边栏
  const closeSidebar = (withoutAnimation = false) => {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 打开侧边栏
  const openSidebar = (withoutAnimation = false) => {
    sidebar.value.opened = true
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 切换设备类型
  const toggleDevice = (val: string) => {
    device.value = val
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // 应用主题
  const applyTheme = (currentTheme: string) => {
    document.documentElement.classList.remove('dark-mode', 'light-mode')
    document.documentElement.classList.add(`${currentTheme}-mode`)
    
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('layout-dark')
    } else {
      document.documentElement.classList.remove('layout-dark')
    }
  }

  // 初始化主题
  const initTheme = () => {
    applyTheme(theme.value)
  }

  return {
    sidebar,
    device,
    theme,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleDevice,
    toggleTheme,
    initTheme
  }
}) 