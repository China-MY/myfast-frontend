<template>
  <div></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const { params, query } = route
  const { path } = params
  const { t } = query
  
  let targetPath = '/'
  if (Array.isArray(path)) {
    targetPath = '/' + path.join('/')
  } else {
    targetPath = typeof path === 'string' ? ('/' + path) : '/'
  }

  if (query && query.path) {
    targetPath = query.path.toString()
  }
  
  console.log(`重定向组件：重定向到 ${targetPath}（时间戳: ${t}）`)
  
  // 路径刷新完成后重定向到目标路径
  router.replace({ path: targetPath }).catch(err => {
    console.error('重定向失败:', err)
    // 如果路由跳转失败，尝试使用location直接跳转
    window.location.href = targetPath
  })
})
</script> 