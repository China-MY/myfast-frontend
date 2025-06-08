<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>对不起，您访问的页面不存在</h2>
      <div class="actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;

  .content {
    text-align: center;

    h1 {
      font-size: 120px;
      font-weight: bold;
      color: var(--el-color-primary);
      margin-bottom: 20px;
      line-height: 1;
    }

    h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 30px;
    }

    .actions {
      .el-button {
        margin: 0 10px;
      }
    }
  }
}
</style>
