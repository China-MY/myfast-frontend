<template>
  <div class="app-container">
    <iframe
      :src="druidUrl"
      frameborder="0"
      style="width: 100%; min-height: 800px"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 直接使用相对路径或绝对路径
const druidUrl = ref('/druid/index.html');

// 也可以根据环境变量设置不同的URL
if (import.meta.env.VITE_API_BASE_URL) {
  druidUrl.value = `${import.meta.env.VITE_API_BASE_URL}/druid/index.html`;
}

console.log('数据监控(Druid)组件加载成功, URL:', druidUrl.value);
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style> 