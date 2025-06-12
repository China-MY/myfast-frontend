<template>
  <div class="app-container">
    <h2>API文档</h2>
    <div class="swagger-container">
      <iframe ref="swaggerIframe" :src="swaggerUrl" class="swagger-iframe"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const swaggerIframe = ref<HTMLIFrameElement | null>(null);

// 使用相对路径，将通过Vite配置的代理访问后端
// 获取当前域名和端口，确保在不同环境下都能正常工作
const baseUrl = window.location.origin;
const currentPath = window.location.pathname;
const apiBase = currentPath.split('/')[1] || '';
const swaggerUrl = ref('/docs');

// 监听iframe加载完成事件
onMounted(() => {
  ///console.log('Swagger组件已加载');
  ///console.log('Swagger URL:', swaggerUrl.value);
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.swagger-container {
  width: 100%;
  height: calc(100vh - 160px);
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.swagger-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>