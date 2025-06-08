import { createPinia } from 'pinia'

// 导入所有store模块
import { useUserStore } from './modules/user'
import { useTagsViewStore } from './modules/tagsView'
import { useAppStore } from './modules/app'
import { useKeepAliveStore } from './modules/keepAlive'

// 创建pinia实例
const pinia = createPinia()

// 导出store创建函数，方便在其他地方使用
export {
  useUserStore,
  useTagsViewStore,
  useAppStore,
  useKeepAliveStore
}

// 导出pinia实例
export default pinia
