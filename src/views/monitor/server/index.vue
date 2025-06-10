<template>
  <div class="app-container">
    <h2>服务器监控</h2>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>服务器信息</span>
        </div>
      </template>
      <div class="server-info">
        <p>服务器监控组件正在加载中...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  console.log('服务器监控组件已加载');
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.server-info {
  margin-top: 10px;
}
</style> 