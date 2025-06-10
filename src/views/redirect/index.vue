<template>
  <div>重定向中...</div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  
  // 获取重定向路径
  const redirectPath = Array.isArray(path) 
    ? '/' + path.join('/') 
    : typeof path === 'string' 
      ? '/' + path 
      : '/index'
      
  console.log('重定向到:', redirectPath, '查询参数:', query)
  
  // 执行重定向
  router.replace({
    path: redirectPath,
    query
  })
})
</script> 