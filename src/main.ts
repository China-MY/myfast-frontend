import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// 导入权限指令
import permission from './directives/permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

// 注册全局指令
app.directive('permission', permission)

app.mount('#app')
