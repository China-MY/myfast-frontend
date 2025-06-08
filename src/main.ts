import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { setupPermissionDirective } from './utils/permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

// 注册自定义指令
setupPermissionDirective(app)

app.mount('#app')
