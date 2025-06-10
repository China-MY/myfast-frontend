<template>
  <div class="app-container">
    <div class="error-page">
      <div class="error-code">401</div>
      <div class="error-desc">对不起，您没有访问权限</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button type="default" @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回首页
const goHome = () => {
  router.push('/');
};

// 返回上一页
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error-page {
  text-align: center;
}

.error-code {
  font-size: 10rem;
  font-weight: 700;
  color: #F56C6C;
}

.error-desc {
  font-size: 1.5rem;
  margin: 20px 0;
}

.error-actions {
  margin-top: 30px;
}
</style> 