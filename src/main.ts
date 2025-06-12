import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import { setupPermissionDirective } from './utils/permission'

// 全局样式
import './styles/reset.css'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册自定义指令
setupPermissionDirective(app)


app.mount('#app')
