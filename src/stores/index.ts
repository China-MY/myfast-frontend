import { createPinia } from 'pinia'

// 导入所有store模块
import { useUserStore } from './modules/user'
import { useTagsViewStore } from './modules/tagsView'

// 创建pinia实例
const pinia = createPinia()

// 导出store创建函数，方便在其他地方使用
export {
  useUserStore,
  useTagsViewStore
}

// 导出pinia实例
export default pinia
