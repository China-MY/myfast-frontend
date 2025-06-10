<template>
  <div class="error-page">
    <div class="error-page-container">
      <div class="error-code">404</div>
      <div class="error-desc">对不起，您访问的页面不存在</div>
      <div class="actions">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 返回首页
const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 500px;
}

.error-page-container {
  text-align: center;
}

.error-code {
  font-size: 120px;
  color: #409EFF;
  line-height: 1.2;
  font-weight: bold;
  margin-bottom: 24px;
}

.error-desc {
  font-size: 24px;
  color: #606266;
  margin-bottom: 30px;
}

.actions {
  margin-top: 20px;
}

.actions .el-button {
  margin: 0 10px;
}
</style>
