<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      <router-link
        v-if="item.path && index < breadcrumbList.length - 1"
        :to="item.path"
      >
        <component v-if="item.meta && item.meta.icon" :is="iconComponents[item.meta.icon]" class="breadcrumb-icon" />
        {{ item.meta && item.meta.title }}
      </router-link>
      <span v-else>
        <component v-if="item.meta && item.meta.icon" :is="iconComponents[item.meta.icon]" class="breadcrumb-icon" />
        {{ item.meta && item.meta.title }}
      </span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter, RouteLocationMatched } from 'vue-router';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  BarsOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  ApiOutlined,
  CodeOutlined,
  FormOutlined,
  IdcardOutlined,
  FontSizeOutlined,
  ToolOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FieldTimeOutlined,
  HomeOutlined
} from '@ant-design/icons-vue';

// 图标组件映射
const iconComponents = {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  BarsOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  ApiOutlined,
  CodeOutlined,
  FormOutlined,
  IdcardOutlined,
  FontSizeOutlined,
  ToolOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FieldTimeOutlined,
  HomeOutlined
};

const route = useRoute();
const router = useRouter();
const breadcrumbList = ref<RouteLocationMatched[]>([]);

// 根据当前路由生成面包屑导航
const getBreadcrumb = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title);

  // 如果没有匹配到面包屑项，添加首页
  if (!matched.length) {
    const home = router.getRoutes().find(r => r.path === '/dashboard');
    if (home) {
      matched = [home];
    }
  }

  // 如果不是从首页开始，添加首页到最前面
  const first = matched[0];
  if (first && first.path !== '/dashboard' && route.path !== '/dashboard') {
    const home = router.getRoutes().find(r => r.path === '/dashboard');
    if (home) {
      matched.unshift(home);
    }
  }

  breadcrumbList.value = matched;
};

// 监听路由变化，更新面包屑
watch(() => route.path, () => {
  getBreadcrumb();
}, { immediate: true });
</script>

<style lang="less" scoped>
.breadcrumb {
  font-size: 14px;

  :deep(.ant-breadcrumb-separator) {
    margin: 0 8px;
  }

  .breadcrumb-icon {
    margin-right: 4px;
  }
}
</style>
